import { getConnection } from '../database/oracleDB.js';

const PRODUCTS = 'BB_PRODUCT';

export const getAllProducts = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const products = await connection.execute(`SELECT * FROM ${PRODUCTS}`);

        const data = products.rows;

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

export const getProduct = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const product = await connection.execute(`SELECT * FROM ${PRODUCTS} WHERE IDPRODUCT = :id`, [req.params.id]);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        const data = product.rows;
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

// Task 2: Create Product
export const createProduct = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const product = { 
            ...req.body,
            PRICE:  parseFloat(req.body.PRICE),
            ACTIVE: parseInt(req.body.ACTIVE)
        };

        await connection.execute('BEGIN PROD_ADD_SP(:in_product_name, :in_description, :in_product_image, :in_price, :in_active); END;', {
            in_product_name:    product.PRODUCTNAME,    // Require: Task 2
            in_description:     product.DESCRIPTION,    // Require: Task 2
            in_product_image:   product.PRODUCTIMAGE,   // Require: Task 2
            in_price:           product.PRICE,          // Require: Task 2
            in_active:          product.ACTIVE          // Require: Task 2
        }, { autoCommit: true });

        res.status(201).json({ message: 'Product created successfully', product });
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

// Task 1: Update Product Description
export const updateProduct = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const product = {
            productid:   parseInt(req.params.id),
            description: req.body.description
        }

       await connection.execute('BEGIN group_task_1(:in_productid, :in_description); END;', {
            in_productid:   product.productid,     // Require: Task 1
            in_description: product.description    // Require: Task 1
        }, { autoCommit: true });

        res.status(200).json({ message: 'Product updated successfully', product });
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

export const deleteProduct = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        const deletedProduct = await connection.execute(`
            DELETE FROM ${PRODUCTS} WHERE idproduct = :idproduct`, 
            { idproduct: req.params.id }, 
            { autoCommit: true }
        );

        if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json({ message: 'Product deleted successfully' });
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

export const deleteAllProducts = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        await connection.execute(`DELETE FROM ${PRODUCTS}`, [], { autoCommit: true });

        res.status(200).json({ message: 'All products deleted successfully' });
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

// Task 6: Get Product Sale
export const getProductSale = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();

        let product = {
            productid: parseInt(req.params.id),
            status: null
        };

        const result = await connection.execute('SELECT CK_SALE_SF(:p_date, :p_product_id) AS sale_status FROM dual', {
            p_date:       req.body.date || Date.now(),    // Require: Task 6
            p_product_id: product.productid               // Require: Task 6
        });

        product.status = result.rows[0].SALE_STATUS;

        res.status(200).json({ product });
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