import express from 'express';
import {
    getAllCoffees,
    getCoffee,
    createCoffee,
    updateCoffee,
    deleteCoffee,
    deleteAllCoffees
} from '../controllers/coffee.controller.js';

const router = express.Router();

router.get('/', getAllCoffees);
router.get('/:id', getCoffee);
router.post('/', createCoffee);
router.put('/:id', updateCoffee);
router.delete('/:id', deleteCoffee);
router.delete('/', deleteAllCoffees);

export default router;
