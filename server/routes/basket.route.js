import express from 'express';
import {
    getBaskets,
    getBasketItems,
    checkBasketItemsInStock,
    addBasketItem,
    updateBasketShippingStatus
} from '../controllers/basket.controller.js';

const router = express.Router();

router.get('/', getBaskets);
router.get('/:idbasket', getBasketItems);
router.get('/:idbasket/status', checkBasketItemsInStock)
router.post('/:idbasket', addBasketItem);
router.put('/:idbasket/shipping', updateBasketShippingStatus);

export default router;