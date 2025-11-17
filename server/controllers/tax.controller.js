import OracleDB from 'oracledb';

import { getConnection } from '../database/oracleDB.js';

// Task 3: Get Tax Amount
export const getTaxAmount = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        let purchase = {
            state:  req.params.state.toUpperCase(),
            subtotal: parseFloat(req.body.subtotal),
            tax: 0,
            total: 0
        };

        const result = await connection.execute('BEGIN TAX_COST_SP(:in_shopper_state, :in_subtotal, :out_tax_amount); END;', {
            in_shopper_state: purchase.state,                                   // Require: Task 3
            in_subtotal:      purchase.subtotal,                                // Require: Task 3
            out_tax_amount: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER }   // Require: Task 3
        });
        
        purchase.tax = result.outBinds.out_tax_amount;
        purchase.total = purchase.subtotal + purchase.tax;

        res.status(200).json({ purchase });
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