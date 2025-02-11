import express from "express"
import { addProduct } from "../controllers/product.controller.js";
import { checkAuth, checkAdmin } from "../middlewares/auth.middleware.js";


const router = express.Router();


router.post("/",checkAuth, checkAdmin, addProduct)


export default router