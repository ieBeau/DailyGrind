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
        const newProduct = {
            productname: req.body.productname,
            description: req.body.description,
            productimage: req.body.productimage,
            price: req.body.price,
            active: req.body.active
        };

        await connection.execute(
            `INSERT INTO ${PRODUCTS} (productname, description, productimage, price, active)
            VALUES (:productname, :description, :productimage, :price, :active)`, 
            newProduct
        );

        res.status(201).json(newProduct);
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

// Task 1: Update Product
export const updateProduct = async (req, res) => {
    let connection;
    try {
        connection = await getConnection();
        const updatedProduct = {
            idproduct: req.body.idproduct,
            productname: req.body.productname,
            description: req.body.description,
            productimage: req.body.productimage,
            price: req.body.price,
            salestart: req.body.salestart,
            saleend: req.body.saleend,
            saleprice: req.body.saleprice,
            active: req.body.active,
            featured: req.body.featured,
            featurestart: req.body.featurestart,
            featureend: req.body.featureend,
            type: req.body.type,
            iddepartment: req.body.iddepartment,
            stock: req.body.stock,
            ordered: req.body.ordered,
            reorder: req.body.reorder
        };

        await connection.execute(
            `UPDATE ${PRODUCTS} SET 
                productname = :productname, 
                description = :description, 
                productimage = :productimage, 
                price = :price, 
                salestart = :salestart, 
                saleend = :saleend, 
                saleprice = :saleprice, 
                active = :active, 
                featured = :featured, 
                featurestart = :featurestart, 
                featureend = :featureend, 
                type = :type, 
                iddepartment = :iddepartment, 
                stock = :stock, 
                ordered = :ordered, 
                reorder = :reorder 
            WHERE idproduct = :idproduct`,
            updatedProduct
        );

        res.status(200).json(updatedProduct);
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

        const deletedProduct = await connection.execute(`DELETE FROM ${PRODUCTS} WHERE idproduct = :idproduct`, [req.params.idproduct]);

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

        await connection.execute(`DELETE FROM ${PRODUCTS}`);

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