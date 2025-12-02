import express from 'express';
import {
    getBaskets,
    createBasket,
    getBasketItems,
    checkBasketItemsInStock,
    addBasketItem,
    updateBasketShippingStatus,
    deleteBasketItem
} from '../controllers/basket.controller.js';

const router = express.Router();

router.get('/', getBaskets);
router.post('/', createBasket);
router.get('/:idbasket', getBasketItems);
router.get('/:idbasket/status', checkBasketItemsInStock)
router.post('/:idbasket', addBasketItem);
router.put('/:idbasket/shipping', updateBasketShippingStatus);
router.put('/:idbasket/:idbasketitem', deleteBasketItem);

export default router;