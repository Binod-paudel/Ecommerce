import express from 'express'
import { createCheckout, updateCheckout, finalizeCheckout } from '../controllers/checkout.controller.js';
import { checkAuth } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post("/",checkAuth, createCheckout);
router.put("/:id/pay", checkAuth, updateCheckout);
router.post("/:id/finalize", checkAuth, finalizeCheckout);


export default router