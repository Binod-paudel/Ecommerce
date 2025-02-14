import express from 'express'
import { addCart, deleteCart, getCart, mergeCart, updateCart } from '../controllers/cart.controller.js';
import { checkAdmin, checkAuth } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post("/", addCart);
router.put("/update",checkAuth, checkAdmin, updateCart)
router.delete("/delete", deleteCart);
router.get("/", getCart);
router.get("/merge", checkAdmin, mergeCart);


export default router