const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://lms-studium.up.railway.app",
    "https://lexicon-lms-backend.onrender.com",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
