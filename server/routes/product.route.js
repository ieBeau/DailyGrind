import express from 'express';
import multer from 'multer';

import {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts,
    getProductSale
} from '../controllers/product.controller.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// GET routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);
router.get('/:id/sale', getProductSale);

// POST routes
router.post('/', upload.single('image'), createProduct);

// PUT routes
router.put('/:id', updateProduct);

// DELETE routes
router.delete('/', deleteAllProducts);
router.delete('/:id', deleteProduct);

export default router;