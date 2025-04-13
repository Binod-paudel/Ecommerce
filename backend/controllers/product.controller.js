import Products from "../models/products.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import apiError from "../utils/apiError.js";

//@desc Get all products with optional filters and limit
//@route GET /api/v2/products
//@access public
const getProducts = asyncHandler(async (req, res) => {
  const { category, gender, limit } = req.query;

  const query = {};

  // Apply category filter (case-insensitive)
  if (category) {
    query.category = { $regex: new RegExp(category, "i") };
  }

  // Apply gender filter (case-insensitive)
  if (gender) {
    query.gender = { $regex: new RegExp(gender, "i") };
  }

  // Build query with optional limit
  let productQuery = Products.find(query);

  // If limit is passed, apply it (converted to Number)
  if (limit) {
    productQuery = productQuery.limit(Number(limit));
  }

  const products = await productQuery.exec();
  res.send(products);
});


//@desc get product by id
//@route /api/v2/products/:id
//@access public
const getProductById = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let product = await Products.findById(id);
  if (!product) {
    throw new apiError(403, "Product not Found!");
  }
  res.send(product);
});

//@desc add products
//@route /api/v2/products
//@access private+admin
const addProduct = asyncHandler(async (req, res) => {
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
    user: req.user._id, // Reference to the admin user who created it
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
  res.send({ message: "Product created successfully!", product });
});

//@desc update product
//@route /api/v2/products/:id
//@access private/admin
const updateProduct = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let product = await Products.findById(id);
  if (!product) {
    throw new apiError(404, "Product not found!");
  }
  product.name = req.body.name || product.name;
  product.description = req.body.description || product.description;
  product.price = req.body.price || product.price;
  product.discountPrice = req.body.discountPrice || product.discountPrice;
  product.category = req.body.category || product.category;
  product.brand = req.body.brand || product.brand;
  product.sizes = req.body.sizes || product.sizes;
  product.collections = req.body.collections || product.collections;
  product.material = req.body.material || product.material;
  product.gender = req.body.gender || product.gender;
  product.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : product.isFeatured;
  product.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : product.isPublished;
  product.tags = req.body.tags || product.tags;
  product.dimensions = req.body.dimensions || product.dimensions;
  product.weight = req.body.weight || product.weight;
  product.sku = req.body.sku || product.sku;

  // Save the updated product
  let updatedProduct = await product.save();
  res.send({ message: "Product is updated successfully!", product: updatedProduct });
});

//@desc delete product by id
//@route /api/v2/products/:id
//@access private + admin
const deleteProduct = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let product = await Products.findById(id);
  if (!product) {
    throw new apiError(404, "Product not found!");
  }
  await Products.findByIdAndDelete(id);
  res.send({ message: "Product deleted successfully!" });
});

//@desc get top-rated products
//@route /api/v2/products/top
//@access public
const getTopProducts = asyncHandler(async (req, res) => {
  let limit = 3;
  let products = await Products.find({}).sort({ rating: -1 }).limit(limit);
  res.send(products);
});

//@desc Retrieve similar products based on the current product's gender and category
//@route GET /api/v2/products/similar/:id
//@access public
const similarProduct = asyncHandler(async (req, res) => {
  let id = req.params.id;
  let product = await Products.findById(id);
  if (!product) {
    throw new apiError(404, "Product not found!");
  }
  let similarProducts = await Products.find({
    _id: { $ne: id }, // Exclude the current product id
    gender: product.gender, // Fixed typo
    category: product.category,
  }).limit(4);
  res.send(similarProducts);
});

// @route GET /api/products/best-seller
//@desc Retrieve the product with highest rating
//@access Public

const bestSellerProduct = asyncHandler(async(req, res)=>{
  let bestSeller = await Products.findOne().sort({rating: -1});
  if(bestSeller){
    res.json(bestSeller);
  }else{
    res.status(404).json({message: "No best seller found"})
  }
})

//@desc Retrieve latest 8 products - Creation date
//@route /api/v2/products/new-arrival
//@access public
const newArrivalProducts = asyncHandler(async (req, res) => {
  let newArrivals = await Products.find().sort({ createdAt: -1 }).limit(8);
  res.send(newArrivals);
});

export { getProducts, addProduct, getProductById, updateProduct, deleteProduct, getTopProducts, similarProduct, bestSellerProduct, newArrivalProducts };
