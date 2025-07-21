const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Redis = require('ioredis'); // Redis istemcisini import et

// Redis istemcisini başlat
// Bu, authController'ın Redis'e doğrudan erişmesini sağlar.
// Ortam değişkenlerini .env dosyasından alacaktır.
const redisClient = new Redis(process.env.REDIS_URI || 'redis://localhost:6379');


redisClient.on('error', (err) => {
    console.error('❌ authController Redis bağlantı hatası:', err);
});

// Kullanıcı kayıt işlemi
const register = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email.includes('@') || password.length < 6) {
        return res.status(400).json({ message: 'Geçersiz giriş.' });
    }

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: 'Bu e-mail zaten kayıtlı.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: 'Kayıt başarılı.' });
    } catch (err) {
        console.error('Kayıt hatası:', err.message);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};

// Kullanıcı giriş işlemi
const login = async (req, res) => {
    const body = req.body || {};
    const { email, password } = body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email veya şifre eksik.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'E-posta kayıtlı değil.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Şifre hatalı.' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // Token 1 gün geçerli olacak
        );

        // Oturum ID'sini Redis'te kullanıcıya bağla (isteğe bağlı, oturum verilerini izlemek için)
        // Eğer Express-Session kullanıyorsanız, oturum ID'si zaten cookie'de tutulur.
        // Buradaki 'session:user_ID' anahtarı daha çok kullanıcı bazlı özel veriler için kullanılabilir.
        // Örneğin: await redisClient.set(`session:user_${user._id}`, req.sessionID, 'EX', 60 * 60 * 24);

        res.status(200).json({
            message: 'Giriş başarılı',
            token,
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (err) {
        console.error('Giriş hatası:', err.message);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};

// Kullanıcı çıkış işlemi (Logout)
const logout = async (req, res) => {
    const authHeader = req.headers.authorization;
    console.log('Logout isteği alındı. Auth Header:', authHeader); // YENİ LOG

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('Token bulunamadı veya formatı hatalı.'); // YENİ LOG
        return res.status(400).json({ message: 'Token bulunamadı veya formatı hatalı.' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Ayıklanan Token:', token); // YENİ LOG
    console.log('JWT SECRET KULLANILIYOR:', process.env.JWT_SECRET ? 'Ayarlı' : 'Ayarlı değil!'); // YENİ LOG

    try {
        // Token'ı doğrula ve süresini al
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token başarıyla doğrulandı. Decoded:', decodedToken); // YENİ LOG

        // Kalan geçerlilik süresi (saniye cinsinden)
        const expiresIn = decodedToken.exp - Math.floor(Date.now() / 1000);
        console.log('Kalan geçerlilik süresi (saniye):', expiresIn); // YENİ LOG

        // Token'ı Redis kara listesine ekle
        console.log(`Redis'e token ekleniyor: blacklist:${token.substring(0, 10)}... (expire: ${expiresIn}s)`); // YENİ LOG
        await redisClient.set(`blacklist:${token}`, 'true', 'EX', expiresIn > 0 ? expiresIn : 1); 
        console.log('Token Redis kara listesine başarıyla eklendi.'); // YENİ LOG

        // Express Session kullanılıyorsa oturumu yok et
        // Buradaki req.session kontrolü, Express-Session middleware'ının kullanılıp kullanılmadığına bağlıdır.
        // Frontend tarafından JWT ile kimlik doğrulama yapılıyorsa bu kısım çalışmayabilir.
        if (req.session) {
            console.log('Express session destroy ediliyor.'); // YENİ LOG
            req.session.destroy((err) => {
                if (err) {
                    console.error('Oturum yok edilirken hata:', err);
                    return res.status(500).json({ message: 'Oturum kapatılırken sunucu hatası.' });
                }
                res.clearCookie('trivagoSessionId'); // Eğer session cookie kullanılıyorsa
                res.status(200).json({ message: 'Başarıyla çıkış yapıldı.' });
            });
        } else {
            console.log('Express session kullanılmıyor veya yok.'); // YENİ LOG
            res.status(200).json({ message: 'Başarıyla çıkış yapıldı.' });
        }

    } catch (error) {
        console.error('Çıkış yaparken HATA yakalandı:', error.name, error.message); // YENİ LOG
        // Eğer token zaten geçersizse (süresi dolmuş veya hatalı imzalı)
        // yine de başarılı bir çıkış mesajı döndürebiliriz, çünkü kullanıcı zaten oturumda değil.
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            return res.status(200).json({ message: 'Başarıyla çıkış yapıldı (token zaten geçersizdi).' });
        }
        res.status(500).json({ message: 'Çıkış yaparken sunucu hatası.' });
    }
};


// Şifremi unuttum
const forgotPassword = async (req, res) => {
    console.log('Şifremi unuttum isteği alındı:', req.body);
    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Geçersiz e-posta.' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Bu e-posta ile kayıtlı kullanıcı bulunamadı.' });
        }

        // Mail atılmayacak ama kullanıcı bulunduysa sahte başarı mesajı
        return res.status(200).json({ message: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.' });
    } catch (err) {
        console.error('Şifremi unuttum hatası:', err.message);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};

const updateAccount = async (req, res) => {
    const { email, firstName, lastName, password, phone } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Geçersiz e-posta adresi.' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        // Şifreyi güncelliyorsan hashle
        const hashedPassword = password && password.length >= 6
            ? await bcrypt.hash(password, 10)
            : user.password; // Eğer şifre verilmezse veya kısaysa mevcut şifreyi koru

        // Güncelleme işlemi
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.password = hashedPassword;
        user.phone = phone || user.phone;

        await user.save();

        res.status(200).json({ message: 'Hesap başarıyla güncellendi.' });
    } catch (err) {
        console.error('Hesap güncelleme hatası:', err.message);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};

const deleteAccount = async (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Geçersiz e-posta adresi.' });
    }

    try {
        const user = await User.findOneAndDelete({ email });

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        // Kullanıcı silindiğinde, ilgili oturumlarını ve JWT kara listelerini de temizlemek isteyebilirsiniz.
        // Örneğin: await redisClient.del(`session:user_${user._id}`);
        // Ancak bu karmaşık olabilir, genellikle JWT'nin süresi dolunca kendi kendine temizlenir.

        res.status(200).json({ message: 'Hesap silindi.' });
    } catch (err) {
        console.error('Hesap silme hatası:', err.message);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
};


module.exports = { register, login, logout, forgotPassword, updateAccount, deleteAccount };