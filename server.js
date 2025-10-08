import config from "./config/config.js";
import app from "./server/express.js";

import dotenv from 'dotenv/config';

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Daily Grind." });
});

app.listen(config.port, (err) => {
  if (err) console.error(`Error starting server: ${err}`); 
  console.log(`Server running at http://localhost:${config.port}/`);
});

export default app;
