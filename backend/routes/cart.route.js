import express from 'express'
import { addCart, updateCart } from '../controllers/cart.controller.js';
import { checkAdmin, checkAuth } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post("/", addCart);
router.put("/update",checkAuth, checkAdmin, updateCart)


export default router