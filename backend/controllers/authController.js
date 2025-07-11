const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
      { expiresIn: '1d' }
    );

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


module.exports = { register, login, forgotPassword};
