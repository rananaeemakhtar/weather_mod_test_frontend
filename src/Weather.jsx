import { useState } from 'react';
import './Weather.css';

/**
 * Weather component
 * Allows the user to enter a city name and fetches weather data from a local Express API.
 * Expected API endpoint: GET http://localhost:5000/weather?city=<city>
 * The API should return JSON with at least a `description` and `temperature` field.
 */
function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Track overall request status: 'idle' | 'loading' | 'success' | 'error' | 'empty'
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city) return;
    // Reset states
    setLoading(true);
    setError(null);
    setWeather(null);
    setStatus('loading');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/weather?city=${encodeURIComponent(city)}`);
      if (!response.ok) {
        // Try to extract error message from response body
        let errMsg = `Server responded with ${response.status}`;
        try {
          const errData = await response.json();
          if (errData && errData.message) {
            errMsg = errData.message;
          }
        } catch (_) {
          // ignore JSON parse errors
        }
        throw new Error(errMsg);
      }
      const { data } = await response.json();
      setWeather(data);
      // Determine if data is empty
      const isEmpty = !data || (typeof data === 'object' && Object.keys(data).length === 0);
      setStatus(isEmpty ? 'empty' : 'success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const unit = weather?.temperature?.unit?.charAt(0).toUpperCase() + weather?.temperature?.unit?.slice(1);

  return (
    <section id="weather-screen">
      {/* Jumbotron Hero */}
      <div className="weather-jumbotron">
        <div className="jumbotron-icon">🌤</div>
        <h1 className="jumbotron-title">Weather Lookup</h1>
        <p className="jumbotron-subtitle">Enter a city name to get current weather conditions</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="weather-form">
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="weather-input"
        />
        <button type="submit" disabled={loading} className="weather-button">
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>

      {/* Status messages */}
      {status === 'loading' && (
        <div className="weather-alert weather-alert--loading">
          <span className="alert-spinner" /> Fetching weather data...
        </div>
      )}
      {status === 'error' && error && (
        <div className="weather-alert weather-alert--error">
          {error}
        </div>
      )}
      {status === 'empty' && (
        <div className="weather-alert weather-alert--empty">
          No weather information available.
        </div>
      )}

      {/* Weather result card */}
      {status === 'success' && weather && (
        <div className="weather-card">
          <div className="card-accent" />
          <h3 className="weather-city">{weather.city}, {weather.country}</h3>

          {weather.condition?.icon && (
            <img
              src={weather.condition.icon}
              alt={weather.condition.label}
              className="weather-icon"
            />
          )}

          <p className="weather-condition-label">{weather.condition?.label}</p>

          <p className="weather-temp">
            {weather.temperature?.current}°{unit}
          </p>
          <p className="weather-feels">
            Feels like {weather.temperature?.feelsLike}°{unit}
          </p>

          <div className="weather-details">
            <div className="detail-item">
              <span className="detail-icon">💧</span>
              <span className="detail-label">Humidity</span>
              <span className="detail-value">{weather.details?.humidity}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-icon">💨</span>
              <span className="detail-label">Wind</span>
              <span className="detail-value">{weather.details?.windSpeed} {weather.details?.windUnit}</span>
            </div>
          </div>

          <p className="weather-fetched">Updated: {new Date(weather.fetchedAt).toLocaleString()}</p>
        </div>
      )}
    </section>
  );
}

export default Weather;
