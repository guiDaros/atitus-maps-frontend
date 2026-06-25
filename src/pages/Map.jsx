import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header/Header.jsx";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { getPoints, postPoint, putPoint, deletePoint } from '../services/mapService';
import { useAuth } from "../contexts/AuthContext";
import { Button } from '../components';
import { FaCheckCircle } from 'react-icons/fa';
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
  const [editPoint, setEditPoint] = useState(null);
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
      setDescriptionText("");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSaveEdit = async () => {
    if (!editPoint) return;
    const updatedData = {
      description: descriptionText || "",
      latitude: editPoint.position.lat,
      longitude: editPoint.position.lng,
    };
    try {
      const updatedPoint = await putPoint(token, editPoint.id, updatedData);
      setMarkers((prev) => prev.map((item) => item.id === editPoint.id ? {
        ...item,
        title: updatedPoint.description || descriptionText || 'Novo Ponto',
      } : item));
      setModalVisible(false);
      setEditPoint(null);
      setDescriptionText("");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleMarkerClick = (marker) => {
    setEditPoint(marker);
    setPendingPoint(null);
    setDescriptionText(marker.title === 'Novo Ponto' ? '' : marker.title || '');
    setModalVisible(true);
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
            <h3 className="modal-title">{editPoint ? 'Editar ponto' : 'Descrição do ponto'}</h3>
            <p className="modal-sub">
              {editPoint
                ? 'Atualize a descrição do ponto existente.'
                : 'Adicione uma descrição (máx. 100 caracteres)'}
            </p>
            <textarea
              className="modal-textarea"
              maxLength={100}
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              placeholder="Digite a descrição..."
            />
            <div className="modal-actions">
              <Button onClick={editPoint ? handleSaveEdit : handleAddDescription}>
                {editPoint ? 'Salvar alterações' : 'Adicionar'}
              </Button>
              <Button onClick={() => { setModalVisible(false); setPendingPoint(null); setEditPoint(null); setDescriptionText(""); }}>Cancelar</Button>
            </div>
          </div>
        </div>
      )}
      {settingsOpen && (
        <div className="settings-overlay" onClick={handleCloseSettings}>
          <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <div>
                <h3>Configurações</h3>
                <p className="settings-header-subtitle">Veja seus dados e status da conta</p>
              </div>
              <button
                className="settings-close"
                type="button"
                onClick={handleCloseSettings}
                aria-label="Fechar configurações"
              >
                ×
              </button>
            </div>

            <div className="settings-profile">
              <div className="settings-avatar">
                {userName ? userName.trim().charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="settings-profile-info">
                <span className="profile-name">{userName || 'Usuário'}</span>
                <span className="profile-role">Usuário</span>
              </div>
            </div>

            <div className="settings-cards">
              <div className="settings-card">
                <div className="settings-card-icon status-icon">
                  <FaCheckCircle />
                </div>
                <div>
                  <span className="settings-card-label">Status da Conta</span>
                  <p className="settings-card-value">
                    <span className="status-badge">
                      <FaCheckCircle className="status-badge-icon" />
                      Autenticado
                    </span>
                  </p>
                </div>
              </div>
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
