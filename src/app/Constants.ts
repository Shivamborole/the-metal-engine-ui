export const API_URL = {
  local: 'https://localhost:7025/api',
  production: 'https://the-metal-engine-c0hkhye8a2fbcubk.canadacentral-01.azurewebsites.net/api'
};

// AUTO SELECT
export const BASE_API_URL =
  window.location.hostname === 'localhost'
    ? API_URL.local
    : API_URL.production;
