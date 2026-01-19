// Load environment variables
require("dotenv").config();
// Core & middleware
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fetch = require("node-fetch");


// Routes
const authRoutes = require("./routes/authRoutes"); // CommonJS

const app = express();

/* =========================
   TRUST PROXY (IMPORTANT)
========================= */
app.set("trust proxy", 1); // Needed if behind Render, Nginx, Cloudflare

/* =========================
   SECURITY HEADERS
========================= */
app.use(helmet());
app.disable("x-powered-by");

/* =========================
   BODY PARSER LIMIT
========================= */
app.use(express.json({ limit: "10kb" }));

/* =========================
   COOKIE PARSER
========================= */
app.use(cookieParser());

/* =========================
   CORS PROTECTION
========================= */
app.use(
  cors({
    origin: "https://login-yahoog7dk4mx2pqab9xf3st8k.onrender.com", // your Live Server port
    credentials: true,
    methods: ["GET", "POST"]
  })
);


/* =========================
   GLOBAL RATE LIMIT
========================= */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  standardHeaders: true,
  legacyHeaders: false
});

app.use(globalLimiter);

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Internal server error"
  });
});



const YOUR_URL = "https://login-yahoog7dk4mx2pqab9xf3st8k.onrender.com"; // Replace with your Render URL

function ping() {
    fetch(YOUR_URL)
        .then(res => console.log(`Pinged Render at ${new Date().toISOString()} - Status: ${res.status}`))
        .catch(err => console.error("Ping failed:", err.message));
}

// Ping every


/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
