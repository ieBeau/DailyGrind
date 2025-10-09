import { configDB } from "../../config/config.js";

import oracleDB from "oracledb";

import 'dotenv/config';

oracleDB.outFormat = oracleDB.OUT_FORMAT_OBJECT;

async function getConnection() {
    return await oracleDB.getConnection(configDB);
}

export default getConnection;
