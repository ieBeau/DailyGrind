import { configServer } from "./config/config.js";
import { initOraclePool, closePool } from './database/oracleDB.js';

import app from "./express.js";

const startServer = async () => {
  try {
    await initOraclePool(); // ✅ initialize pool once
  } catch (error) {
    console.error('⚠️ Failed to initialize database pool:', error);
    process.exit(1);
  } finally {
    app.listen(configServer.port, (err) => {
      configServer.env === 'development'
        ? console.log(`Server running on http://localhost:${configServer.port}/`)
        : console.log(`Server running on https://dailygrind-server.onrender.com`);
    });
  }
};

process.on('SIGINT', async () => {
  await closePool();
  process.exit(0);
});

process.on('unhandledRejection', async (reason) => {
  console.error('💥 Unhandled Promise Rejection:', reason);
  await closePool();
  process.exit(1);
});

startServer();

export default app;
