import express from 'express';
import { 
    createAccount, 
    signIn, 
    signOut, 
    validate 
} from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/', createAccount);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.get('/validate', validate);

export default router;
