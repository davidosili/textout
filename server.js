// server.js

// Load environment variables
require("dotenv").config();

// Core & middleware
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fetch = require("node-fetch");
const path = require("path");

// Routes
const authRoutes = require("./routes/authRoutes");

const app = express();

/* =========================
   TRUST PROXY (RENDER / NGINX)
========================= */
app.set("trust proxy", 1);

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
    origin: "https://login-yahoog7dk4mx2pqab9xf3st8k.onrender.com",
    credentials: true,
    methods: ["GET", "POST"],
  })
);

/* =========================
   GLOBAL RATE LIMIT
========================= */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

/* =========================
   SERVE STATIC FILES
========================= */
app.use(express.static(path.join(__dirname, "login.html")));

// Serve login.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

/* =========================
   API ROUTES
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
  res.status(500).json({ message: "Internal server error" });
});

/* =========================
   RENDER PING (KEEP ALIVE)
========================= */
const YOUR_URL = "https://login-yahoog7dk4mx2pqab9xf3st8k.onrender.com";

function pingRender() {
  fetch(YOUR_URL)
    .then((res) =>
      console.log(`Pinged Render at ${new Date().toISOString()} - Status: ${res.status}`)
    )
    .catch((err) => console.error("Ping failed:", err.message));
}

// Ping every 14 minutes
setInterval(pingRender, 14 * 60 * 1000);
pingRender();

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
