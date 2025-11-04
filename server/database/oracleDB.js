import 'dotenv/config';

import { configDB } from "../config/config.js";

import oracleDB from "oracledb";

oracleDB.outFormat = oracleDB.OUT_FORMAT_OBJECT;

let pool;

export const initOraclePool = async () => {
  if (pool) return pool;

  pool = await oracleDB.createPool({
    ...configDB,
    poolMin: 1,
    poolMax: 5,
    poolIncrement: 1,
  });

  console.log('✅ Oracle connection pool started');

  return pool;
};

export const getConnection = async () => {
    if (!pool) throw new Error('Oracle pool not initialized. Call initOraclePool() first.');
    return await pool.getConnection();
}

export const closePool = async () => {
  if (pool) {
    await pool.close(0);
    console.log('🛑 Oracle connection pool closed');
  }
};
