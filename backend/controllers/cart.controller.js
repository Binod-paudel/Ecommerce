import Cart from "../models/cart.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import apiError from "../utils/apiError.js";
import Products from "../models/products.model.js";

// Helper function to get or create a cart
const getOrCreateCart = async (userId, guestId) => {
  let cart =
    (await Cart.findOne({ user: userId })) || (await Cart.findOne({ guestId }));

  if (!cart) {
    cart = await Cart.create({
      user: userId || undefined,
      guestId: guestId || `guest_${Date.now()}`,
      products: [],
      totalPrice: 0,
    });
  }
  return cart;
};

// @desc Add a product to the cart
// @route POST /api/v2/cart
// @access Public
const addCart = asyncHandler(async (req, res) => {
  const { productId, quantity, size, color, guestId, userId } = req.body;

  const product = await Products.findById(productId);
  if (!product) throw new apiError(404, "Product not found!");

  let cart = await getOrCreateCart(userId, guestId);

  // Find the product in cart
  let productIndex = cart.products.findIndex(
    (p) =>
      p.productId.toString() === productId &&
      p.size === size &&
      p.color === color
  );

  if (productIndex > -1) {
    cart.products[productIndex].quantity += quantity;
  } else {
    cart.products.push({
      productId,
      name: product.name,
      image: product.images[0].url,
      price: product.price,
      size,
      color,
      quantity,
    });
  }

  // Recalculate total price
  cart.totalPrice = cart.products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();
  res.json(cart);
});

//@desc Update Product quantity in the cart for a guest or logged -in user
//@route PUT /api/v2/cart
//@access public

const updateCart = asyncHandler(async (req, res) => {
  let { productId, quantity, size, color, guestId, userId } = req.body;
  let cart = await getOrCreateCart(userId, guestId);
  if (!cart) {
    throw new apiError(404, "Cart not Found!");
  }
  let productIndex = cart.products.findIndex(
    (p) =>
      p.productId.toString() === productId &&
      p.size === size &&
      p.color === color
  );
  if (productIndex > -1) {
    //update quantity
    if (quantity > 0) {
      cart.products[productIndex].quantity = quantity;
    } else {
      cart.products.splice(productIndex, 1); //Remove product if quantity is 0
    }

    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    await cart.save();
    res.send(cart);
  } else {
    throw new apiError(404, "Product not found in cart!");
  }
});

//@desc delete product
//@route DELETE /api/v2/cart
//@access public

const deleteCart = asyncHandler(async (req, res) => {
  let { productId, size, color, guestId, userId } = req.body;
  let cart = await getOrCreateCart(userId, guestId);
  if (!cart) {
    throw new apiError(404, "Cart not Found!");
  }
  let productIndex = cart.products.findIndex(
    (p) =>
      p.productId.toString() === productId &&
      p.size === size &&
      p.color === color
  );
  if (productIndex > -1) {
    cart.products.splice(productIndex, 1);
    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    await cart.save();
    res.send(cart);
  } else {
    throw new apiError(404, "Product not found in cart");
  }
});

//@desc get logged-in user's or guest users's cart
//@route GET /api/v2/cart
//@access public

const getCart = asyncHandler(async (req, res) => {
  let { userId, guestId } = req.body;
  let cart = await getOrCreateCart(userId, guestId);
  if (!cart) {
    throw new apiError(404, "Cart not found!");
  }
  res.send(cart);
});

// @desc Merge guest cart into user cart on login
// @route POST /api/v2/merge
// @access Private
const mergeCart = asyncHandler(async (req, res) => {
  const { guestId } = req.body;
  const userId = req.user._id;

  const guestCart = await Cart.findOne({ guestId });
  const userCart = await Cart.findOne({ user: userId });

  if (!guestCart || guestCart.products.length === 0) return res.json({ message: "Guest cart is empty or not found" });

  if (userCart) {
    guestCart.products.forEach((guestItem) => {
      const productIndex = userCart.products.findIndex(
        (item) => item.productId.toString() === guestItem.productId.toString() && item.size === guestItem.size && item.color === guestItem.color
      );
      
      if (productIndex > -1) {
        userCart.products[productIndex].quantity += guestItem.quantity;
      } else {
        userCart.products.push(guestItem);
      }
    });
    
    userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await userCart.save();
    await Cart.deleteOne({ guestId });
    return res.json(userCart);
  }
  
  guestCart.user = userId;
  guestCart.guestId = undefined;
  await guestCart.save();
  res.json(guestCart);
});

export { addCart, updateCart, deleteCart, getCart,mergeCart };
