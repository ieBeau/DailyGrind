import 'dotenv/config';

import { configDB } from "../config/config.js";

import oracleDB from "oracledb";

oracleDB.outFormat = oracleDB.OUT_FORMAT_OBJECT;

async function getConnection() {
    return await oracleDB.getConnection(configDB);
}

export default getConnection;
