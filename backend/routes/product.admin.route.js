import express from "express";
import { checkAdmin, checkAuth } from "../middlewares/auth.middleware.js";
import { getProducts } from "../controllers/product.admin.controller.js";

const router = express.Router();

router.get("/", checkAuth, checkAdmin, getProducts)

export default router