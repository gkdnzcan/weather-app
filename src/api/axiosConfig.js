import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5/',
});

api.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    appid: import.meta.env.VITE_WEATHER_API_KEY, // Tırnakları silme, sadece içini değiştir
    units: 'metric',
    lang: 'tr',
  };
  return config;
});

export default api;