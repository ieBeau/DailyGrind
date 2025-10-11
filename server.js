import { configServer } from "./config/config.js";
import app from "./server/express.js";

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Daily Grind." });
});

app.listen(configServer.port, (err) => {
  configServer.env === 'development'
    ? console.log(`Server running on http://localhost:${configServer.port}/`)
    : console.log(`Server running on https://dailygrind-server.onrender.com`);
});

export default app;
