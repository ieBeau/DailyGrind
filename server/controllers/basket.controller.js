import { getConnection } from '../database/oracleDB.js';

const BASKETS = 'BB_BASKET';
const STATUS = 'BB_BASKETSTATUS';
const SEQUENCE = 'BB_STATUS_SEQ';

// Task 4: Update Basket Status
export const updateBasketStatus = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const updatedBasket = {
            idbasket: req.body.idbasket,
            idstatus: req.body.idstatus,
            dtstage: new Date(),
            shipper: req.body.shipper,
            shippingnum: req.body.shippingnum
        };

        const status = await connection.execute(`-
            INSERT INTO ${STATUS} (idstatus, idbasket, idstage, dtstage, shipper, shippingnum) 
            VALUES (${SEQUENCE}.NEXTVAL, :idbasket, 3, :dtstage, :shipper, :shippingnum)`,
            updatedBasket
        );

        const data = status.rows;
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