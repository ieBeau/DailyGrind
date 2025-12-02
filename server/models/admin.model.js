import OracleDB from 'oracledb';
import { getConnection } from '../database/oracleDB.js';

import bcrypt from 'bcryptjs';

const TABLE_NAME = 'BB_ADMIN';

const findByUsername = async (username) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(
            `SELECT * FROM ${TABLE_NAME} WHERE username = :username`,
            { username },
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );

        const row = result.rows && result.rows.length ? result.rows[0] : null;

        return getInstance(row);
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
};

const findById = async (adminId) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(
            `SELECT * FROM ${TABLE_NAME} WHERE admin_id = :id`,
            { id: adminId },
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );

        const row = result.rows && result.rows.length ? result.rows[0] : null;

        return getInstance(row);
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
};

const save = async (email, username, password) => {
    let connection;
    try {
        if (!email || !username || !password) throw new Error('Email, username, and password are required');

        connection = await getConnection();

        const passwordSalt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, passwordSalt);

        // 1) check if email or username already exists
        const existing = await connection.execute(
            `SELECT EMAIL, USERNAME FROM ${TABLE_NAME} WHERE EMAIL = :email OR USERNAME = :username`,
            { email, username },
            { outFormat: OracleDB.OUT_FORMAT_OBJECT }
        );

        if (existing.rows && existing.rows.length) {
            const row = existing.rows[0];
            if (row.EMAIL === email) return { success: false, user: null, message: 'email in use' };
            if (row.USERNAME === username) return { success: false, user: null, message: 'username in use' };
            return { success: false, user: null, message: 'conflict' };
        }

        // 2) insert if no conflict
        const result = await connection.execute(
            `INSERT INTO ${TABLE_NAME} (USERNAME, EMAIL, PASSWORD_HASH, PASSWORD_SALT)
             VALUES (:username, :email, :passwordHash, :passwordSalt)
             RETURNING ADMIN_ID, USERNAME, EMAIL, IS_ACTIVE, CREATED_AT
             INTO :id, :usernameOut, :emailOut, :activeOut, :createdOut`,
            {
                username,
                email,
                passwordHash,
                passwordSalt,
                id: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER },
                usernameOut: { dir: OracleDB.BIND_OUT, type: OracleDB.STRING, maxSize: 50 },
                emailOut: { dir: OracleDB.BIND_OUT, type: OracleDB.STRING, maxSize: 254 },
                activeOut: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER, maxSize: 1 },
                createdOut: { dir: OracleDB.BIND_OUT, type: OracleDB.TIMESTAMP }
            },
            { autoCommit: true }
        );

        return { success: true, user: result.outBinds, message: 'created' };
    } catch (error) {
        return { success: false, user: null, message: error.message };
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
}

const updateLastLogin = async (adminId) => {
    let connection;
    try {
        connection = await getConnection();
        await connection.execute(
            `UPDATE ${TABLE_NAME} SET last_login = SYSTIMESTAMP WHERE admin_id = :id`,
            { id: adminId },
        );
        await connection.commit();
    } catch (error) {
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error closing connection:', err);
            }
        }
    }
};

const AdminSchema = { findByUsername, findById, save, updateLastLogin };


const getMethods = {
    authenticate: async function(password) {
        return await bcrypt.compare(password, this.PASSWORD_HASH);
    },
    updateLastLogin: async function() {
        return await AdminSchema.updateLastLogin(this.ADMIN_ID);
    }
};

const getInstance = (row) => {
    if (!row) return null;

    return {
        ...row,
        ...getMethods
    };
};

export default AdminSchema;