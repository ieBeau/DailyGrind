import OracleDB from 'oracledb';
import { getConnection } from '../database/oracleDB.js';

export const getBaskets = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`SELECT * FROM BB_BASKET`);
        res.status(200).json(result.rows);
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

export const createBasket = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute(`
            INSERT INTO BB_BASKET DEFAULT VALUES RETURNING IDBASKET INTO :idbasket`, 
            {
                idbasket: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER }
            }, { autoCommit: true }
        );

        res.status(201).json({ message: "Basket created successfully!", idbasket: result.outBinds.idbasket[0] });
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

export const getBasketItems = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(`
            SELECT * FROM BB_BASKETITEM BI
            LEFT JOIN BB_PRODUCT P
            ON BI.IDPRODUCT = P.IDPRODUCT 
            WHERE IDBASKET = :idbasket
        `, {
            idbasket: req.params.idbasket
        });

        res.status(200).json(result.rows);
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

// Task 5: Add Basket Item
export const addBasketItem = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const basket_item = {
            productid: parseInt(req.body.productid),
            basketid:  parseInt(req.params.idbasket),
            price:     parseFloat(req.body.price),
            quantity:  parseInt(req.body.quantity),
            sizecode:  parseInt(req.body.sizecode),
            formcode:  parseInt(req.body.formcode)
        }

        await connection.execute('BEGIN BASKET_ADD_SP(:p_productid, :p_basketid, :p_price, :p_quantity, :p_sizecode, :p_formcode); END;', {
            p_productid: basket_item.productid, // Require: Task 5
            p_basketid:  basket_item.basketid,  // Require: Task 5
            p_price:     basket_item.price,     // Require: Task 5
            p_quantity:  basket_item.quantity,  // Require: Task 5
            p_sizecode:  basket_item.sizecode,  // Require: Task 5
            p_formcode:  basket_item.formcode   // Require: Task 5
        }, { autoCommit: true });

        res.status(200).json({ message: "Basket item added successfully!", basket_item });
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

// Report 1: Check Basket Items in Stock
export const checkBasketItemsInStock = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const result = await connection.execute('BEGIN REPORT_1(:p_basketid, :p_basket_status); END;', {
            p_basketid: parseInt(req.params.idbasket),                          // Require: Report 1
            p_basket_status: { dir: OracleDB.BIND_OUT, type: OracleDB.STRING, } // Require: Report 1
        });

        res.status(200).json(result.outBinds.p_basket_status);
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

// Task 4: Update Shipping Status
export const updateBasketShippingStatus = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const basket_status = {
            ...req.body,
            basketid: parseInt(req.params.idbasket),
            date:     new Date(req.body.date)
        }

        await connection.execute('BEGIN STATUS_SHIP_SP(:in_basketid, :in_date, :in_shipper, :in_shipnum); END;', {
            in_basketid: basket_status.basketid, // Require: Task 4
            in_date:     basket_status.date,     // Require: Task 4
            in_shipper:  basket_status.shipper,  // Require: Task 4
            in_shipnum:  basket_status.shipnum   // Require: Task 4
        }, { autoCommit: true });
        
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

export const deleteBasketItem = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        await connection.execute(`
            DELETE FROM BB_BASKETITEM 
            WHERE IDBASKET = :idbasket AND IDBASKETITEM = :idbasketitem`, 
            { 
                idbasket: parseInt(req.params.idbasket), 
                idbasketitem: parseInt(req.params.idbasketitem) 
            }, { autoCommit: true }
        );

        res.status(200).json({ message: "Basket item deleted successfully!" });
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