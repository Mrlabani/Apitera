const axios = require("axios");
const cheerio = require("cheerio");

module.exports = async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: "Missing ?url= parameter" });

  const LOGIN_URL = "https://www.1024terabox.com/wap/outlogin/login";

  const payload = new URLSearchParams({
    userName: process.env.TBX_USER,
    password: process.env.TBX_PASS
  });

  try {
    // Login and get session cookies
    const loginRes = await axios.post(LOGIN_URL, payload.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0"
      },
      maxRedirects: 0,
      validateStatus: status => status === 302 || status === 200
    });

    const cookies = loginRes.headers["set-cookie"];
    if (!cookies) throw new Error("Login failed – no cookies returned");

    // Use session cookies to access shared URL
    const linkRes = await axios.get(url, {
      headers: {
        "Cookie": cookies.join("; "),
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(linkRes.data);
    const downloadLink = $("a")
      .filter((_, el) => $(el).attr("href")?.includes("download"))
      .attr("href");

    if (downloadLink) {
      res.json({ download: downloadLink });
    } else {
      res.status(404).json({ error: "Download link not found." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
