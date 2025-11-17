import { getConnection } from '../database/oracleDB.js';

// Task 4: Update Shipping Status
export const updateShippingStatus = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const basket_status = {
            ...req.body,
            basketid: parseInt(req.body.basketid),
            date:     new Date(req.body.date)
        }

        await connection.execute('BEGIN STATUS_SHIP_SP(:in_basketid, :in_date, :in_shipper, :in_shipnum); END;', {
            in_basketid: basket_status.basketid, // Require: Task 4
            in_date:     basket_status.date,     // Require: Task 4
            in_shipper:  basket_status.shipper,  // Require: Task 4
            in_shipnum:  basket_status.shipnum   // Require: Task 4
        });
        
        res.status(200).json({ message: "Shipping status updated successfully!", basket_status });
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