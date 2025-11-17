import express from 'express';
import {
    updateShippingStatus
} from '../controllers/shipping.controller.js';

const router = express.Router();

router.put('/', updateShippingStatus);

export default router;