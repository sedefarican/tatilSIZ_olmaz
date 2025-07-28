import User from '../models/User.js'; // Varsayılan (default) export olduğunu varsayıyoruz

// Eğer bcryptjs veya jsonwebtoken gibi başka require'lar varsa, onları da import'a çevirin
import bcrypt from 'bcryptjs'; // 'bcryptjs' için
import jwt from 'jsonwebtoken'; // 'jsonwebtoken' için

// Kayıt fonksiyonu
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Kullanıcı zaten var mı kontrolü (örnek)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta adresi zaten kayıtlı.' });
    }

    // Şifreyi hash'le (örnek)
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt rounds

    // Yeni kullanıcı oluştur (örnek)
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: 'Kullanıcı başarıyla kaydedildi.' });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    res.status(500).json({ message: 'Kayıt sırasında bir hata oluştu.' });
  }
};

// Giriş fonksiyonu
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcıyı bul (örnek)
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Geçersiz kimlik bilgileri.' });
    }

    // Şifreyi karşılaştır (örnek)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Geçersiz kimlik bilgileri.' });
    }

    // JWT oluştur (örnek)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Başarıyla giriş yapıldı.', token, user: { id: user._id, email: user.email, username: user.username } });
  } catch (error) {
    console.error('Giriş hatası:', error);
    res.status(500).json({ message: 'Giriş sırasında bir hata oluştu.' });
  }
};

// Şifremi Unuttum fonksiyonu (mock)
export const forgotPassword = (req, res) => {
  // Şifre sıfırlama mantığı
  res.status(200).json({ message: 'Şifre sıfırlama talebi alındı (mock).' });
};

// Hesap Güncelleme fonksiyonu (mock)
export const updateAccount = (req, res) => {
  // Hesap güncelleme mantığı
  res.status(200).json({ message: 'Hesap başarıyla güncellendi (mock).' });
};

// Hesap Silme fonksiyonu (mock)
export const deleteAccount = (req, res) => {
  // Hesap silme mantığı
  res.status(200).json({ message: 'Hesap başarıyla silindi (mock).' });
};

// Çıkış fonksiyonu (mock)
export const logout = (req, res) => {
  // Çıkış mantığı (örneğin JWT'yi client tarafında silmek yeterli olabilir)
  res.status(200).json({ message: 'Başarıyla çıkış yapıldı.' });
};
