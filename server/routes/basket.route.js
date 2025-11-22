import express from 'express';
import {
    addBasketItem,
    checkBasketItemsInStock
} from '../controllers/basket.controller.js';

const router = express.Router();

router.post('/', addBasketItem);
router.get('/item_status', checkBasketItemsInStock)

export default router;