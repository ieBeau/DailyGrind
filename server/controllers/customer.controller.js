import { getConnection } from '../database/oracleDB.js';

const TABLE_NAME = 'BB_SHOPPER';

export const getCustomerById = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const shopperId = parseInt(req.params.id);

        const result = await connection.execute(
            `SELECT * FROM ${TABLE_NAME} WHERE idshopper = :id`,
            { id: shopperId }
        );

        res.status(200).json(result.rows[0]);
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
};

// Report 2: Get Customer Total Spending
export const getCustomerTotalSpending = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        let shopper = {
            shopper_id: parseInt(req.params.id),
            total_spending: 0
        };
        
        const result = await connection.execute('SELECT TOT_PURCH_SF(:p_shopper_id) AS total_spending FROM dual', {
            p_shopper_id: shopper.shopper_id // Require: Report 2
        });

        shopper.total_spending = result.rows[0].TOTAL_SPENDING || 0;
        
        res.status(200).json(shopper);
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
};