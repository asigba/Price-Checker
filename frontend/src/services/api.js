import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

export const addProduct = async (url) => {
  const response = await axios.post(`${API_URL}/products`, { url });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/products/${id}`);
  return response.data;
};

export const updatePrice = async (id) => {
  const response = await axios.put(`${API_URL}/products/${id}/price`);
  return response.data;
};