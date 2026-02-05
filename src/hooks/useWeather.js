import { useState } from 'react';
import api from '../api/axiosConfig';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeather = async (city) => {
    if (!city || city.trim() === "") return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('weather', { params: { q: city } });
      setWeatherData(response.data);
    } catch (err) {
      // Hatanın ne olduğunu konsolda görmek profesyonelce bir yaklaşımdır
      console.error("API Hatası:", err); 
      setError('Şehir bulunamadı.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return { weatherData, loading, error, fetchWeather };
};