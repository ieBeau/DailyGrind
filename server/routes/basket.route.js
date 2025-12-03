import express from 'express';
import {
    getBaskets,
    createBasket,
    getBasketItems,
    checkBasketItemsInStock,
    addBasketItem,
    updateShippingStatus,
    deleteBasketItem
} from '../controllers/basket.controller.js';

const router = express.Router();

router.get('/', getBaskets);
router.post('/', createBasket);
router.get('/:idbasket', getBasketItems);
router.get('/:idbasket/status', checkBasketItemsInStock)
router.post('/:idbasket', addBasketItem);
router.put('/:idbasket/shipping', updateShippingStatus);
router.delete('/:idbasket/item/:idbasketitem', deleteBasketItem);

export default router;