import axios from 'axios';

const API_URL = 'https://atitus-maps-backend.onrender.com/auth';

function getApiErrorMessage(error, fallback) {
  const data = error.response?.data;
  if (typeof data === 'string' && data.trim()) {
    return data;
  }
  return data?.message || fallback;
}

export async function signIn(email, password) {
  try {
    const response = await axios.post(`${API_URL}/signin`, { email, password });
    if (response.status === 200) {
      return response.data;
    }
    throw new Error('Erro ao autenticar.');
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error(getApiErrorMessage(error, 'Requisição inválida.'));
      }
      if (error.response.status === 401) {
        throw new Error(getApiErrorMessage(error, 'Usuário ou senha incorretos.'));
      }
      throw new Error(getApiErrorMessage(error, 'Erro ao autenticar.'));
    }
    throw new Error('Erro ao autenticar.');
  }
}

export async function signUp(name, email, password) {
  try {
    const response = await axios.post(`${API_URL}/signup`, { name, email, password });
    if (response.status === 200) {
      return response.data;
    }
    throw new Error('Erro ao cadastrar usuário.');
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400) {
        throw new Error(getApiErrorMessage(error, 'Requisição inválida.'));
      }
      if (error.response.status === 409) {
        throw new Error(getApiErrorMessage(error, 'Usuário já cadastrado.'));
      }
      throw new Error(getApiErrorMessage(error, 'Erro ao cadastrar usuário.'));
    }
    throw new Error('Erro ao cadastrar usuário.');
  }
}
