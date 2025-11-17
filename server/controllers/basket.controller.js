import OracleDB from 'oracledb';
import { getConnection } from '../database/oracleDB.js';

const BASKETS = 'BB_BASKET';

// Task 5: Add Basket Item
export const addBasketItem = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const basket_item = {
            productid: parseInt(req.body.productid),
            basketid:  parseInt(req.body.basketid),
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
        });

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

        let basket = {
            basketid: parseInt(req.body.basketid),
            status: null
        }

        const result = await connection.execute('BEGIN REPORT_1(:p_basketid, :p_basket_status); END;', {
            p_basketid: basket.basketid,                                        // Require: Report 1
            p_basket_status: { dir: OracleDB.BIND_OUT, type: OracleDB.STRING, } // Require: Report 1
        });

        basket.status = result.outBinds.p_basket_status;

        res.status(200).json({ basket });
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