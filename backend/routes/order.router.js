import express from 'express'
import { getOrder, getOrderDetails } from '../controllers/order.controller.js';
import { checkAuth } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.get("/my-orders", checkAuth, getOrder);
router.get("/:id", checkAuth, getOrderDetails);

export default router;