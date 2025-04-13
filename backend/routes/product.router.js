import express from "express";
import {
  addProduct,
  bestSellerProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getTopProducts,
  newArrivalProducts,
  similarProduct,
  updateProduct,
} from "../controllers/product.controller.js";
import { checkAuth, checkAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").get(getProducts).post(checkAuth, checkAdmin, addProduct);
router.get("/topproducts", getTopProducts);
router.get("/similar/:id", similarProduct);
router.get("/new-arrival", newArrivalProducts);
router.get("/best-seller", bestSellerProduct);
router.get("/:id", getProductById);  // ✅ This route should exist
router
  .route("/:id")
  .put(checkAuth, checkAdmin, updateProduct)
  .delete(checkAuth, checkAdmin, deleteProduct);

export default router;
