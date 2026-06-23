import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header/Header.jsx";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getPoints, postPoint, putPoint, deletePoint } from '../services/mapService';
import { useAuth } from "../contexts/AuthContext";
import { Button } from '../components';
import './map.css';

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
  const navigate = useNavigate();
  const { token, userName, logout } = useAuth();
  const [markers, setMarkers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingPoint, setPendingPoint] = useState(null);
  const [descriptionText, setDescriptionText] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSettingsClick = () => setSettingsOpen(true);
  const handleCloseSettings = () => setSettingsOpen(false);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
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
    // open modal to ask for description
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setPendingPoint({ latitude: lat, longitude: lng });
    setDescriptionText("");
    setModalVisible(true);
  };

  const handleAddDescription = async () => {
    if (!pendingPoint) return;
    const pointData = {
      latitude: pendingPoint.latitude,
      longitude: pendingPoint.longitude,
      description: descriptionText || "",
    };
    try {
      const savedPoint = await postPoint(token, pointData);
      const savedMarker = {
        id: savedPoint.id,
        title: savedPoint.description || "Novo Ponto",
        position: {
          lat: savedPoint.latitude,
          lng: savedPoint.longitude,
        },
      };
      setMarkers((prev) => [...prev, savedMarker]);
      setModalVisible(false);
      setPendingPoint(null);
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
      <Header isMapScreen onSettingsClick={handleSettingsClick} />

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
                onClick={() => handleMarkerClick(marker)}
                onRightClick={() => handleMarkerRightClick(marker)}
              />
            ))}
          </GoogleMap>
        ) : (
          <div>Carregando mapa...</div>
        )}
      </div>
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">Descrição do ponto</h3>
            <p className="modal-sub">Adicione uma descrição (máx. 100 caracteres)</p>
            <textarea
              className="modal-textarea"
              maxLength={100}
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              placeholder="Digite a descrição..."
            />
            <div className="modal-actions">
              <Button onClick={handleAddDescription}>Adicionar</Button>
              <Button onClick={() => { setModalVisible(false); setPendingPoint(null); }}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
      {settingsOpen && (
        <div className="settings-overlay" onClick={handleCloseSettings}>
          <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h3>Minha conta</h3>
              <button
                className="settings-close"
                type="button"
                onClick={handleCloseSettings}
                aria-label="Fechar configurações"
              >
                ×
              </button>
            </div>

            <div className="settings-field">
              <span className="settings-label">Nome</span>
              <strong>{userName || 'Usuário'}</strong>
            </div>

            <div className="settings-field">
              <span className="settings-label">Status</span>
              <span>Autenticado</span>
            </div>

            <div className="settings-actions">
              <Button type="button" onClick={handleLogout}>Sair</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
