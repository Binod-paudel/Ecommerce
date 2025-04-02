import express from "express";

import { checkAuth, checkAdmin } from "../middlewares/auth.middleware.js";

import { deleteOrder, getOrders, upateOrderStatus } from "../controllers/admin.order.js";

const router = express.Router();

router.get("/", checkAuth, checkAdmin, getOrders);
router.put("/:id" , checkAuth, checkAdmin, upateOrderStatus)
router.delete("/:id", checkAuth, checkAdmin, deleteOrder)

export default router;
