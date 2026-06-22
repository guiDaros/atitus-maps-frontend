import axios from 'axios';

const API_BASE = 'https://atitus-maps-backend.onrender.com';
const BASE_URL = `${API_BASE}/ws/point`;

export async function getPoints(token) {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const points = response.data.map(point => ({
      id: point.id,
      title: point.descricao,
      position: {
        lat: point.latitude,
        lng: point.longitude,
      },
    }));

    if (response.status === 200) {
      return points;
    } else {
      throw new Error('Erro ao buscar pontos');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar pontos');
  }
}

export async function postPoint(token, pointData) {
  try {
    const response = await axios.post(BASE_URL, pointData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error('Erro ao cadastrar ponto');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao cadastrar ponto');
  }
}

export async function putPoint(token, pointId, pointData) {
  try {
    const response = await axios.put(`${BASE_URL}/${pointId}`, pointData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error('Erro ao atualizar ponto');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao atualizar ponto');
  }
}

export async function deletePoint(token, pointId) {
  try {
    const response = await axios.delete(`${BASE_URL}/${pointId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200 || response.status === 204) {
      return true;
    } else {
      throw new Error('Erro ao excluir ponto');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao excluir ponto');
  }
}
