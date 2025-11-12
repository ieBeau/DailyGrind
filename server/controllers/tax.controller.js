import { getConnection } from '../database/oracleDB.js';

const TAXES = 'BB_TAX';

// Task 3: Get Tax Amount
export const getTaxAmount = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const input = {
            state: req.params.state.toUpperCase(),
            subtotal: parseFloat(req.params.subtotal)
        }

        const taxes = parseFloat(await connection.execute(`SELECT * FROM ${TAXES} WHERE STATE = :state`, [input.state]).rows[0]);
        
        const data = input.subtotal * taxes;
        res.status(200).json(data);
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