import { useEffect, useState } from "react";
import Header from "../components/Header/Header.jsx";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getPoints, postPoint, putPoint, deletePoint } from '../services/mapService';
import { useAuth } from "../contexts/AuthContext";

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Como pegar a posição atual do usuário?
// Dica: use Geolocation API do navegador
const center = {
  lat: -23.55052,
  lng: -46.633308,
};

export const Map = () => {
  const { token } = useAuth();
  const [markers, setMarkers] = useState([]);
  
  // Substitua pela sua chave da API do Google Maps
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    async function fetchMarkers() {
      try {
        const data = await getPoints(token);
        setMarkers(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchMarkers();
  }, [token]);

  // Função para adicionar ponto ao clicar no mapa
  const handleMapClick = async (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const newPoint = {
      latitude: lat,
      longitude: lng,
      description: "Descrição do ponto",
    };
    try {
      const savedPoint = await postPoint(token, newPoint);
      const savedMarker = {
        id: savedPoint.id,
        title: savedPoint.description || "Novo Ponto",
        position: {
          lat: savedPoint.latitude,
          lng: savedPoint.longitude,
        },
      };
      setMarkers((prev) => [...prev, savedMarker]);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleMarkerClick = async (marker) => {
    const newDescription = window.prompt("Editar descrição do ponto:", marker.title);
    if (!newDescription || newDescription.trim() === marker.title) {
      return;
    }

    try {
      const updatedPoint = await putPoint(token, marker.id, {
        description: newDescription,
        latitude: marker.position.lat,
        longitude: marker.position.lng,
      });

      setMarkers((prev) => prev.map((item) => item.id === marker.id ? {
        ...item,
        title: updatedPoint.description || newDescription,
      } : item));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleMarkerRightClick = async (marker) => {
    const confirmed = window.confirm("Excluir este ponto?");
    if (!confirmed) {
      return;
    }

    try {
      await deletePoint(token, marker.id);
      setMarkers((prev) => prev.filter((item) => item.id !== marker.id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <Header isMapScreen />

      <div style={{ width: "100%", height: "100vh" }}>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            onClick={handleMapClick}
          >
            {markers.map(marker => (
              <Marker
                key={marker.id}
                position={marker.position}
                title={marker.title}
              />
            ))}
          </GoogleMap>
        ) : (
          <div>Carregando mapa...</div>
        )}
      </div>
    </>
  );
};
