import asyncHandler from "../middlewares/asyncHandler.js";
import Products from "../models/products.model.js";

//@route GET /api/admin/products
//@desc get all products(Admin only)
//@access Private/Admin

const getProducts = asyncHandler(async (req, res) => {
  let products = await Products.find({});
  res.send(products);
});

export { getProducts };
