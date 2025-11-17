import express from 'express';
import {
    getCustomerTotalSpending
} from '../controllers/customer.controller.js';

const router = express.Router();

router.get('/:id', getCustomerTotalSpending);
export default router;