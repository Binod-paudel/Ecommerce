import express from 'express'
import { addCart, deleteCart, getCart, mergeCart, updateCart } from '../controllers/cart.controller.js';
import { checkAdmin, checkAuth } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post("/", addCart);
router.put("/", updateCart)
router.delete("/", deleteCart);
router.get("/", getCart);
router.post("/merge", checkAuth, mergeCart);


export default router