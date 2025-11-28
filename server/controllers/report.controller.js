import oracledb from 'oracledb';
import { getConnection } from "../database/oracleDB.js";

export const reportStatus = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const basketId = parseInt(req.params.basketId, 10);
        const result = await connection.execute(
            `BEGIN REPORT_1(:p_basket_id, :p_status); END;`,
            {
                p_basket_id: basketId,
                p_status: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 100 }
            }
        );

        const status = result.outBinds.p_status;
        res.status(200).json({ basketId, status });
    } catch (error) {
        res.status(500).json({ message: error.message });
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

export const totalPurchases = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const shopperId = parseInt(req.params.shopperId, 10);
        const result = await connection.execute(
            `SELECT TOT_PURCH_SF(:p_shopper_id) AS total FROM dual`,
            {
                p_shopper_id: shopperId
            }
        );
        const total = result.rows[0].TOTAL;
        res.status(200).json({ shopperId, total });
    } catch (error) {
        res.status(500).json({ message: error.message });
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