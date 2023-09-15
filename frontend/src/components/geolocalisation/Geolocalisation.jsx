import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GeolocationComponent({getGeolocalisation}) {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        handleSuccess,
        handleError
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      fetchCountryData(latitude, longitude);
    }
  }, [latitude, longitude]);

  const handleSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    setLatitude(latitude);
    setLongitude(longitude);
  };

  const handleError = (error) => {
    setError(`Geolocation error: ${error.message}`);
  };

  const fetchCountryData = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      const countryData = response.data && response.data.address;
      if (countryData) {
        setCountry(countryData.country);
        getGeolocalisation({
          longitude: longitude,
          latitude: latitude,
          country: countryData.country
        })
      }
    } catch (err) {
      setError(`Error fetching country data: ${err.message}`);
    }
  };

  return (
    <div>
      <h2 >Geolocalisation</h2>
      {latitude && longitude && (
        <p>Latitude: {latitude}, Longitude: {longitude}</p>
      )}
      {country && <p>Country: {country}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}

export default GeolocationComponent;
