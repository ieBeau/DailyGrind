import express from 'express';
import {
    getAllProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts,
    getProductSale
} from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id/sale', getProductSale);
router.get('/:id', getProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.delete('/', deleteAllProducts);

export default router;