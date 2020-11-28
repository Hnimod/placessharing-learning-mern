const axios = require('axios');
const AppError = require('./appError');

const API_KEY = 'AIzaSyBUgN9lAyZha_e-e1fucW6qTziZOlwmrCk';

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const { data } = response;

  if (!data || data.status !== 'OK') {
    return new AppError('Could not find the location', 422);
  }
  const coordinates = data.results[0].geometry.location;
  return coordinates;
}

module.exports = getCoordsForAddress;
