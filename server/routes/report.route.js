import express from 'express';
import { reportStatus, totalPurchases } from '../controllers/report.controller.js';

const router = express.Router();

router.get('/status/:basketId', reportStatus);
router.get('/total-purchases/:shopperId', totalPurchases);


export default router;