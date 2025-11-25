import express from 'express';
import {
    getAllShoppers,
    getShopperById,
    getShopperTotalSpending
} from '../controllers/shopper.controller.js';

const router = express.Router();

router.get('/', getAllShoppers);
router.get('/:id', getShopperById);
router.get('/:id/spending', getShopperTotalSpending);

export default router;