import { useState, useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import { getWeatherIconUrl } from './utils/weatherIcons';

// Hava durumuna göre arka plan temaları
const weatherThemes = {
  Clear: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
  Clouds: 'linear-gradient(135deg, #64748b 0%, #334155 100%)', 
  Rain: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',    
  Drizzle: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', 
  Snow: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',    
  Thunderstorm: 'linear-gradient(135deg, #4c1d95 0%, #1e1b4b 100%)', 
  Default: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)'  
};

function App() {
  const [city, setCity] = useState('');
  const { weatherData, loading, error, fetchWeather } = useWeather();
  
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('weatherHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Profesyonel Dokunuş: Veri geldikçe sayfa başlığını (sekme ismini) güncelle
  useEffect(() => {
    if (weatherData) {
      document.title = `${Math.round(weatherData.main.temp)}°C | ${weatherData.name}`;
    } else {
      document.title = 'Hava Durumu Uygulaması';
    }
  }, [weatherData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
      updateHistory(city.trim());
    }
  };

  const updateHistory = (newCity) => {
    setHistory((prev) => {
      const filtered = prev.filter(item => item.toLowerCase() !== newCity.toLowerCase());
      const updated = [newCity, ...filtered].slice(0, 5);
      localStorage.setItem('weatherHistory', JSON.stringify(updated));
      return updated;
    });
  };

  const currentTheme = weatherData 
    ? (weatherThemes[weatherData.weather[0].main] || weatherThemes.Default) 
    : weatherThemes.Default;

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      transition: 'background 1.0s ease', 
      background: currentTheme,
      padding: '20px'
    }}>
      <div className="container">
        <h1>Hava Durumu</h1>
        
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Şehir ismini yazın..." 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            autoFocus
          />
          <button type="submit" disabled={loading}>
            {loading ? '...' : 'Ara'}
          </button>
        </form>

        {history.length > 0 && !weatherData && !loading && (
          <div style={{ marginBottom: '20px', display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
            {history.map((hCity, index) => (
              <button 
                key={index} 
                onClick={() => { setCity(hCity); fetchWeather(hCity); }}
                style={{ padding: '5px 10px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer' }}
              >
                {hCity}
              </button>
            ))}
          </div>
        )}

        {error && <div style={{ color: '#ffb3b3', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}

        {weatherData && !loading && (
          <div className="weather-info">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{weatherData.name}</h2>
            <img src={getWeatherIconUrl(weatherData.weather[0].icon)} alt="ikon" style={{ width: '100px' }} />
            <div className="temp" style={{ fontSize: '3rem', fontWeight: 'bold' }}>{Math.round(weatherData.main.temp)}°C</div>
            <div className="desc" style={{ fontSize: '1.2rem', textTransform: 'capitalize', marginBottom: '20px' }}>{weatherData.weather[0].description}</div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '15px' }}>
              <div>
                <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>Hissedilen</p>
                <p><b>{Math.round(weatherData.main.feels_like)}°C</b></p>
              </div>
              <div>
                <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>Nem</p>
                <p><b>%{weatherData.main.humidity}</b></p>
              </div>
              <div>
                <p style={{ opacity: 0.7, fontSize: '0.8rem' }}>Rüzgar</p>
                <p><b>{weatherData.wind.speed} m/s</b></p>
              </div>
            </div>
          </div>
        )}

        {!weatherData && !loading && !error && (
          <p style={{ opacity: 0.7, marginTop: '20px' }}>Başlamak için bir şehir aratın.</p>
        )}
      </div>
    </div>
  );
}

export default App;