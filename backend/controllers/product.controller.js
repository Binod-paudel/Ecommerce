import Products from "../models/products.model.js";
import asynchandler from "../middlewares/asyncHandler.js";
import apiError from "../utils/apiError.js"
import asyncHandler from "../middlewares/asyncHandler.js";


//@get all products
//@route /api/v2/products
//@access public

const getProducts = asynchandler(async(req, res)=>{
  let products = await Products.find({});
  res.send(products);
})


//@desc get product by id
//@route /api/v2/product
//@access public
const getProductById = asynchandler(async(req, res)=>{
  let id = req.params.id;
  let product = await Products.findById(id);
  if(!product){
    throw new apiError(403, "product not Found!");
  }
  res.send(product);
})


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

//@desc update product
//@route /api/v2/products/:id
//access private/admin
const updateProduct = asyncHandler(async(req, res)=>{
  let id = req.params.id;
  let product = await Products.findById(id);
  if(!product){
    throw new apiError(404, "Product not found!");
  }
  product.name= req.body.name || product.name;
  product.description= req.body.description || product.description;
  product.price= req.body.price || product.price;
  product.discountPrice= req.body.discountPrice || product.discountPrice;
  product.category= req.body.category || product.category;
  product.brand= req.body.brand || product.brand;
  product.sizes= req.body.sizes || product.sizes;
  product.collections= req.body.collections || product.collections;
  product.material= req.body.material || product.material;
  product.gender= req.body.gender || product.gender;
  product.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : product.isFeatured;
  product.isPublished = req.body.isPublished !== undefined ? req.body.isPublished : product.isPublished;  
  product.tags= req.body.tags || product.tags;
  product.dimensions= req.body.dimensions || product.dimensions;
  product.weight= req.body.weight || product.weight;
  product.sku= req.body.sku || product.sku;

  //save the updated product
  let updatedProduct = await product.save();
  res.send({message: "Product is updated succesfully!", product: updatedProduct})

});


//@desc delete product by id
//@route /api/v2/products
//access private + admin
const deleteProduct = asyncHandler(async(req, res)=>{
  let id = req.params.id;
  let product = await Products.findById(id);
  if(!product){
    throw new apiError(404, "Proudct not found!");
  }
  await Products.findByIdAndDelete(id);
  res.send({message: "product deleted succesfully!"});
})

const getTopProducts = asyncHandler(async(req, res)=>{
  let limit = 3;
  let products = await Products.find({}).sort({rating: -1}).limit(limit);
  res.send(products);
})

//@desc Retrieve similar products based on the current product's gender and category
//@route GET /api/v2/products/similar/:id
//@access public
const similarProduct = asyncHandler(async(req,res)=>{
  let id = req.params.id;
  let products = await Products.findById(id);
  if(!products){
    throw new apiError(404, "Product not found!")
  }
  let similarProducts = await Products.find({
    _id: {$ne: id}, //Exclude the current product id
    gneder: products.gender,
    category: products.category,
  }).limit(4);
  res.send(similarProducts);
})


//@desc Retrieve latest 8 products -Creation data
const newArrivalProducts = asynchandler(async(req, res)=>{
  let newArrivals = await Products.find().sort({ createdAt: -1}).limit(8);
  res.send(newArrivals);
})




export {getProducts, addProduct, getProductById, updateProduct, deleteProduct, getTopProducts, similarProduct, newArrivalProducts}
