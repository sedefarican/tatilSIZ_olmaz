import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; //bu leafleat ikonları için gerekli

// Leaflet ikon problemini çözen standart kod
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const cityCoordinates = {
    "İstanbul": [41.0082, 28.9784],
    "Ankara": [39.9255, 32.8662],
    "İzmir": [38.4237, 27.1428],
    "Antalya": [36.8969, 30.7133],
    "Bursa": [40.1885, 29.0634],
    "Adana": [37.0000, 35.3213],
    "Muğla": [37.2154, 28.3636],
    "Adana": [36.98542, 35.32502],
    "Balıkesir": [39.644878, 27.885361],
    "Bolu": [40.732006, 31.607052],
    "Denizli":[37.783026, 29.096246],
    "Erzurum":[39.905994, 41.273784]
};

function MapFocusController({ city }) {
  const map = useMap();
  useEffect(() => {
    const coords = cityCoordinates[city];
    if (coords) {
      // flyTo, haritayı yumuşak bir geçişle kaydırır. Zoom seviyesi 10 olarak ayarlandı.
      map.flyTo(coords, 10);
    }
  }, [city, map]); // Sadece şehir değiştiğinde çalışır.
  return null;
}

const MapView = ({ selectedCity }) => {
  const cityCenter = cityCoordinates[selectedCity] || [39.9255, 32.8662];

  return (
    <div style={{ height: "80vh", width: "100%", borderRadius: '8px', overflow: 'hidden', border: '1px solid #e0e0e0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <MapContainer
        center={cityCenter}
        zoom={10} // Başlangıç zoom seviyesi
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true} // Haritada mouse tekerleği ile zoom yapmayı aktif eder
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Artık otel listesiyle işimiz yok. Sadece tek bir pin gösteriyoruz. */}
        <Marker position={cityCenter}>
          <Popup>
            <strong>{selectedCity}</strong>
          </Popup>
        </Marker>

        {/* Controller'ı çağırarak haritanın dinamik olarak odaklanmasını sağlıyoruz */}
        <MapFocusController city={selectedCity} />
      </MapContainer>
    </div>
  );
};

export default MapView;