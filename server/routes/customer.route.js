import express from 'express';
import {
    getCustomerById,
    getCustomerTotalSpending
} from '../controllers/customer.controller.js';

const router = express.Router();

router.get('/:id', getCustomerById);
router.get('/:id/spending', getCustomerTotalSpending);

export default router;