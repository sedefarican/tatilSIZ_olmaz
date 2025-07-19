// ResultPage.js'NİN FİLTRELERİ GERİ GELMİŞ, SAYISIZ, TAM VE EKSİKSİZ HALİ

import React, { useState, useEffect, useCallback, useContext } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import MapView from "./MapView";
import SearchBar from "./SearchBar";
import { CurrencyContext } from "../context/CurrencyContext";

export default function ResultPage() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { currency } = useContext(CurrencyContext);

  const {
    hotel: initialHotel = "Ankara",
    checkIn: initialCheckIn = new Date().toISOString().slice(0, 10),
    checkOut: initialCheckOut = (() => {
      const d = new Date();
      d.setDate(new Date().getDate() + 1);
      return d.toISOString().slice(0, 10);
    })(),
  } = location.state || {};

  const [hotels, setHotels] = useState([]);
  const [minPrice, setMinPrice] = useState(50);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [filter, setFilter] = useState("");
  const [payment, setPayment] = useState("");
  const [stayType, setStayType] = useState("");
  const [selectedCity, setSelectedCity] = useState(initialHotel);
  const [showPricePopup, setShowPricePopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const [userEmail, setUserEmail] = useState("");
  const [favoriteIds, setFavoriteIds] = useState(new Set());

  const cities = [
    "Adana",
    "Adıyaman",
    "Afyonkarahisar",
    "Ağrı",
    "Amasya",
    "Ankara",
    "Antalya",
    "Artvin",
    "Aydın",
    "Balıkesir",
    "Bilecik",
    "Bingöl",
    "Bitlis",
    "Bolu",
    "Burdur",
    "Bursa",
    "Çanakkale",
    "Çankırı",
    "Çorum",
    "Denizli",
    "Diyarbakır",
    "Edirne",
    "Elazığ",
    "Erzincan",
    "Erzurum",
    "Eskişehir",
    "Gaziantep",
    "Giresun",
    "Gümüşhane",
    "Hakkari",
    "Hatay",
    "Isparta",
    "Mersin",
    "İstanbul",
    "İzmir",
    "Kars",
    "Kastamonu",
    "Kayseri",
    "Kırklareli",
    "Kırşehir",
    "Kocaeli",
    "Konya",
    "Kütahya",
    "Malatya",
    "Manisa",
    "Kahramanmaraş",
    "Mardin",
    "Muğla",
    "Muş",
    "Nevşehir",
    "Niğde",
    "Ordu",
    "Rize",
    "Sakarya",
    "Samsun",
    "Siirt",
    "Sinop",
    "Sivas",
    "Tekirdağ",
    "Tokat",
    "Trabzon",
    "Tunceli",
    "Şanlıurfa",
    "Uşak",
    "Van",
    "Yozgat",
    "Zonguldak",
    "Aksaray",
    "Bayburt",
    "Karaman",
    "Kırıkkale",
    "Batman",
    "Şırnak",
    "Bartın",
    "Ardahan",
    "Iğdır",
    "Yalova",
    "Karabük",
    "Kilis",
    "Osmaniye",
    "Düzce",
  ];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored?.email) {
      setUserEmail(stored.email);
      axios
        .get("http://localhost:5000/api/favorites", {
          params: { userEmail: stored.email },
        })
        .then((res) =>
          setFavoriteIds(new Set(res.data.map((fav) => fav.hotelId)))
        )
        .catch((err) => console.error("Favoriler çekilemedi:", err));
    }
  }, []);

  const fetchHotels = useCallback(
    async (params) => {
      setLoading(true);
      try {
        const finalParams = {
          ...params,
          currency,
          checkIn: params.checkIn || initialCheckIn,
          checkOut: params.checkOut || initialCheckOut,
          lang: i18n.language,
        };
        const res = await axios.get("http://localhost:5000/api/hotels", {
          params: finalParams,
        });
        setHotels(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
        setHotels([]);
      }
      setLoading(false);
    },
    [currency, initialCheckIn, initialCheckOut, i18n.language]
  );

  useEffect(() => {
    const initialSearchParams = {
      location: initialHotel,
      checkIn: initialCheckIn,
      checkOut: initialCheckOut,
      minPrice,
      maxPrice,
      stayType,
      feature: filter,
      payment,
    };
    fetchHotels(initialSearchParams);
  }, [
    location.state,
    currency,
    fetchHotels,
    initialHotel,
    initialCheckIn,
    initialCheckOut,
    minPrice,
    maxPrice,
    stayType,
    filter,
    payment,
    i18n.language,
  ]);

  const handleToggleFavorite = async (hotel, isCurrentlyFavorite) => {
    if (!userEmail) {
      alert("Favorilere eklemek için lütfen giriş yapın.");
      return;
    }
    const hotelId = hotel.id;

    if (isCurrentlyFavorite) {
      try {
        await axios.delete(`http://localhost:5000/api/favorites/${hotelId}`, {
          data: { userEmail },
        });
        setFavoriteIds((prev) => {
          const newIds = new Set(prev);
          newIds.delete(hotelId);
          return newIds;
        });
      } catch (err) {
        console.error("Favori silinemedi", err);
      }
    } else {
      try {
        const payload = {
          userEmail,
          hotelId,
          hotelTitle: hotel.title,
          price: hotel.priceForDisplay,
          image: hotel.cardPhotos?.[0]?.sizes?.urlTemplate
            ?.replace("{width}", "100")
            ?.replace("{height}", "100"),
        };
        await axios.post("http://localhost:5000/api/favorites", payload);
        setFavoriteIds((prev) => new Set(prev).add(hotelId));
      } catch (err) {
        console.error("Favori eklenemedi", err);
      }
    }
  };

  const handleFilterClick = () => {
    const filterParams = {
      location: selectedCity,
      checkIn: initialCheckIn,
      checkOut: initialCheckOut,
      minPrice: minPrice,
      maxPrice: maxPrice,
      stayType: stayType,
      feature: filter,
      payment: payment,
    };
    fetchHotels(filterParams);
  };
  const applyPriceFilter = () => {
    setShowPricePopup(false);
    handleFilterClick();
  };

  return (
    <div className="results-page-column">
      <SearchBar
        hotel={initialHotel}
        checkIn={initialCheckIn}
        checkOut={initialCheckOut}
        guests="2 Misafir, 1 Oda"
      />

      {/* --- FİLTRELEME ÇUBUĞU - DOLDURULMUŞ VE TAM HALİ --- */}
      <div className="filter-bar">
        <div className="filter-block price-filter-wrapper">
          <label>{t("resultPage.price")}</label>
          <div
            className="fake-input"
            onClick={() => setShowPricePopup((p) => !p)}
          >
            {currency === "TRY" ? "₺" : "$"} {minPrice} -{" "}
            {currency === "TRY" ? "₺" : "$"} {maxPrice}
          </div>
          {showPricePopup && (
            <div className="price-popup">
              <h4>{t("resultPage.setPriceRange")}</h4>
              <div className="price-toggle">
                <button className="active">{t("resultPage.nightly")}</button>
                <button>{t("resultPage.total")}</button>
              </div>
              <div className="range-wrapper">
                <input
                  type="range"
                  min="50"
                  max="50000"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                />
                <input
                  type="range"
                  min="50"
                  max="50000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>
              <div className="price-inputs">
                <input
                  type="text"
                  value={`${currency === "TRY" ? "₺" : "$"}${minPrice}`}
                  readOnly
                />
                <input
                  type="text"
                  value={`${currency === "TRY" ? "₺" : "$"}${maxPrice}`}
                  readOnly
                />
              </div>
              <div className="price-popup-actions">
                <button
                  className="cancel"
                  onClick={() => setShowPricePopup(false)}
                >
                  {t("common.no")}
                </button>
                <button className="apply" onClick={applyPriceFilter}>
                  {t("common.yes")}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="filter-block">
          <label>{t("resultPage.feature")}</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">{t("common.select")}</option>
            <option value="kahvalti">{t("resultPage.breakfast")}</option>
            <option value="spa">{t("resultPage.spa")}</option>
            <option value="wifi">{t("resultPage.wifi")}</option>
            <option value="otopark">{t("resultPage.parking")}</option>
          </select>
        </div>
        <div className="filter-block">
          <label>{t("resultPage.payment")}</label>
          <select value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option value="">{t("common.select")}</option>
            <option value="pesin">{t("resultPage.cash")}</option>
            <option value="kredi">{t("resultPage.card")}</option>
            <option value="iptal">{t("resultPage.cancelable")}</option>
          </select>
        </div>
        <div className="filter-block">
          <label>{t("resultPage.stayType")}</label>
          <select
            value={stayType}
            onChange={(e) => setStayType(e.target.value)}
          >
            <option value="">{t("common.select")}</option>
            <option value="otel">{t("resultPage.hotel")}</option>
            <option value="villa">{t("resultPage.villa")}</option>
            <option value="apart">{t("resultPage.apart")}</option>
            <option value="bungalov">{t("resultPage.bungalow")}</option>
          </select>
        </div>
        <div className="filter-block">
          <label>{t("resultPage.location")}</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">{t("common.select")}</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-block">
          <label style={{ visibility: "hidden" }}>Filtrele</label>
          <button className="apply" onClick={handleFilterClick}>
            {t("resultPage.applyFilter")}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          marginTop: "24px",
        }}
      >
        <div
          style={{
            width: "50%",
            maxHeight: "80vh",
            overflowY: "auto",
            padding: "16px",
            backgroundColor: "#fff",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            borderRadius: "8px",
          }}
        >
          {loading ? (
            <p>Yükleniyor...</p>
          ) : hotels.length === 0 ? (
            <p>Arama kriterlerinize uygun sonuç bulunamadı.</p>
          ) : (
            hotels.map((hotel, index) => {
              const isFavorite = favoriteIds.has(hotel.id);
              const image =
                hotel.cardPhotos?.[0]?.sizes?.urlTemplate
                  ?.replace("{width}", "200")
                  .replace("{height}", "200") ||
                "https://via.placeholder.com/150";
              const rating = hotel.bubbleRating?.rating?.toFixed(1) ?? "N/A";
              const reviewCount =
                hotel.bubbleRating?.count?.replace(/\(|\)/g, "") ?? "0";
              const displayPrice = hotel.priceForDisplay || "Fiyat bilgisi yok";
              const detailsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                hotel.title || ""
              )}`;

              return (
                <div
                  key={`${hotel.id}-${index}`}
                  style={{
                    position: "relative",
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    border: "1px solid #ddd",
                    padding: "10px",
                    borderRadius: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <a
                    href={detailsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      color: "inherit",
                      display: "contents",
                    }}
                  >
                    <img
                      src={image}
                      alt={hotel.title || "Otel Resmi"}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <div>
                      <h3
                        style={{
                          fontSize: "1rem",
                          fontWeight: "bold",
                          margin: "0 0 4px 0",
                        }}
                      >
                        {hotel.title || "Bilinmeyen Otel"}
                      </h3>
                      <p
                        style={{
                          fontSize: "0.85rem",
                          color: "#555",
                          margin: "0 0 4px 0",
                        }}
                      >
                        {rating} ★ ({reviewCount} yorum)
                      </p>
                      <p style={{ fontSize: "0.85rem", marginTop: "4px" }}>
                        <strong>{displayPrice}</strong>
                      </p>
                    </div>
                  </a>
                  <button
                    onClick={() => handleToggleFavorite(hotel, isFavorite)}
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "24px",
                      color: isFavorite ? "#ff4081" : "#ccc",
                      transition: "color 0.2s",
                    }}
                    title={
                      isFavorite ? "Favorilerden Kaldır" : "Favorilere Ekle"
                    }
                  >
                    {" "}
                    ♥{" "}
                  </button>
                </div>
              );
            })
          )}
        </div>
        <div style={{ width: "50%" }}>
          <MapView selectedCity={selectedCity} />
        </div>
      </div>
    </div>
  );
}
