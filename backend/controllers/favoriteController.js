export const addFavorite = async (req, res) => {
  try {
    // const { userEmail, hotelId, hotelTitle, price, image } = req.body;
    // const newFavorite = new Favorite({ userEmail, hotelId, hotelTitle, price, image });
    // await newFavorite.save();
    console.log('Favori ekleme isteği alındı:', req.body);
    res.status(201).json({ message: 'Favori başarıyla eklendi (mock).' });
  } catch (error) {
    console.error('Favori eklerken hata oluştu:', error);
    res.status(500).json({ message: 'Favori eklenirken bir hata oluştu.' });
  }
};

// Favorileri getirme 
export const getFavorites = async (req, res) => {
  try {
    const { userEmail } = req.query;
    // const favorites = await Favorite.find({ userEmail });
    console.log('Favori getirme isteği alındı, userEmail:', userEmail);
    // Mock veri döndürüyoruz, gerçekte veritabanından çekilmeli
    res.status(200).json([
        // { hotelId: "1", hotelTitle: "Hilton Ankara", price: "$180", image: "..." },
        // { hotelId: "5", hotelTitle: "Çırağan Palace Kempinski Istanbul", price: "$500", image: "..." }
    ]);
  } catch (error) {
    console.error('Favorileri çekerken hata oluştu:', error);
    res.status(500).json({ message: 'Favoriler çekilirken bir hata oluştu.' });
  }
};

// Favori silme fonksiyonu
export const deleteFavorite = async (req, res) => {
  try {
    const { hotelId } = req.params;
    console.log('Favori silme isteği alındı, hotelId:', hotelId, 'userEmail:', req.body?.userEmail);
    res.status(200).json({ message: 'Favori başarıyla silindi (mock).' });
  } catch (error) {
    console.error('Favori silerken hata oluştu:', error);
    res.status(500).json({ message: 'Favori silinirken bir hata oluştu.' });
  }
};
