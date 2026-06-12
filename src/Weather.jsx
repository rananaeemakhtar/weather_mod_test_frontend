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

  return (
    <section id="weather-screen" className="weather-section">
      <h2 className="weather-title">Weather Lookup</h2>
      <form onSubmit={handleSubmit} className="weather-form">
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="weather-input"
        />
        <button type="submit" disabled={loading} className="weather-button">
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>
      {/* Status messages */}
      {status === 'loading' && <p className="weather-loading">Fetching weather data...</p>}
      {status === 'error' && error && <p className="weather-error">Error: {error}</p>}
      {status === 'empty' && <p className="weather-empty">No weather information available.</p>}
      {status === 'success' && weather && (
        <div className="weather-card">
          <h3 className="weather-city">{weather.city}, {weather.country}</h3>
          <p className="weather-condition">
            {weather.condition?.label}
            {weather.condition?.icon && (
              <img src={weather.condition?.icon} alt={weather.condition?.label} className="weather-icon" />
            )}
          </p>
          <p className="weather-temp">
            {weather.temperature?.current}°{weather.temperature?.unit?.charAt(0).toUpperCase()}{weather.temperature?.unit?.slice(1)}
            <span className="weather-feels"> (Feels like: {weather.temperature?.feelsLike}°{weather.temperature?.unit?.charAt(0).toUpperCase()}{weather.temperature?.unit?.slice(1)})</span>
          </p>
          <p className="weather-humidity">Humidity: {weather.details?.humidity}%</p>
          <p className="weather-wind">Wind: {weather.details?.windSpeed} {weather.details?.windUnit}</p>
          <p className="weather-fetched">Updated: {new Date(weather.fetchedAt).toLocaleString()}</p>
        </div>
      )}
    </section>
  );
}

export default Weather;
