import express from 'express';
import {
    getTaxAmount
} from '../controllers/tax.controller.js';

const router = express.Router();

router.post('/:state', getTaxAmount);

export default router;