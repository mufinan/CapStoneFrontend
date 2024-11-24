import axios from 'axios';

const api = axios.create({
  baseURL: 'https://capstone-mtlt.onrender.com/api/v1', // Backend URL'nizi burada belirleyin
});

export default api;
