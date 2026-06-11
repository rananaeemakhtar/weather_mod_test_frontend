import { useState } from 'react';

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
      const data = await response.json();
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
    <section id="weather-screen" style={{ padding: '1rem' }}>
      <h2>Weather Lookup</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {weather && (
        <div>
          <p>City: {city}</p>
          <p>Description: {weather.description}</p>
          <p>Temperature: {weather.temperature}°C</p>
        </div>
      )}
    </section>
  );
}

export default Weather;
