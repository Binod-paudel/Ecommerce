import Products from "../models/products.model.js";
import asynchandler from "../middlewares/asyncHandler.js";


//@desc add products
//@route /api/v2/proudcts
//@acess private+admin
const addProduct = asynchandler(async (req, res) => {
  let {
    name,
    description,
    price,
    discountPrice,
    countInStock,
    category,
    brand,
    sizes,
    collections,
    material,
    gender,
    images,
    isFeatured,
    isPublished,
    tags,
    dimensions,
    weight,
    sku,
  } = req.body;
  let product = await Products.create({
     user: req.user._id, //Reference to the admin user who created it
     name,
     description,
     price,
     discountPrice,
     countInStock,
     category,
     brand,
     sizes,
     collections,
     material,
     gender,
     images,
     isFeatured,
     isPublished,
     tags,
     dimensions,
     weight,
     sku,
  });
  res.send({message: "Proudct created successfully!", product});
});

export {addProduct}
