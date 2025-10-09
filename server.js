import { configServer } from "./config/config.js";
import app from "./server/express.js";

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Daily Grind." });
});

app.listen(configServer.port, (err) => {
  if (err) console.error(`Error starting server: ${err}`);
  console.log(`Server running at http://localhost:${configServer.port}/`);
});

export default app;
