/* eslint-disable no-undef */
// config.js

// Determine if we're running in production or development
const isProduction =
  process.env.NODE_ENV === "production" ||
  window.location.hostname !== "localhost";

// Base URLs for different environments
const config = {
  development: {
    baseUrl: "http://localhost:8080",
    apiUrl: "http://localhost:8080",
  },
  production: {
    baseUrl: "https://lexicon-lms.onrender.com",
    apiUrl: "https://lexicon-lms.onrender.com",
  },
};

// Export the configuration based on the environment
const activeConfig = isProduction ? config.production : config.development;

export default activeConfig;
