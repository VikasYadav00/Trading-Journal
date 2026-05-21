import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/trades/';

const getConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` },
  };
};

const getTrades = async () => {
  const response = await axios.get(API_URL, getConfig());
  return response.data.data;
};

const addTrade = async (tradeData) => {
  const response = await axios.post(API_URL, tradeData, getConfig());
  return response.data.data;
};

const updateTrade = async (id, tradeData) => {
  const response = await axios.put(API_URL + id, tradeData, getConfig());
  return response.data.data;
};

const deleteTrade = async (id) => {
  const response = await axios.delete(API_URL + id, getConfig());
  return response.data;
};

const tradeService = { getTrades, addTrade, updateTrade, deleteTrade };
export default tradeService;
