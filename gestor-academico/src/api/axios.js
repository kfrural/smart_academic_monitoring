import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.exemplo.com', // Substitua pelo URL da sua API
  timeout: 1000,
  headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')} // Adicione autenticação se necessário
});

export default instance;
