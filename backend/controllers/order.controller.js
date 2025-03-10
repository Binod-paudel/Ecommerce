import asyncHandler from "../middlewares/asyncHandler.js";
import Order from "../models/order.model.js";
import apiError from '../utils/apiError.js'

//@desc Get logged-in user's orders
//@route GET /api/orders/my-orders
//@access private

const getOrder = asyncHandler(async (req, res) => {
  //find orders for the authenticated user
  let orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }); //sort by most recent orders
  res.send(orders);
});

//@desc vGet order details by ID
//@route GET /api/v2/orders/:id
//@access private

const getOrderDetails = asyncHandler(async (req, res) => {
  let order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if(!order){
    throw new apiError(404, "Order not found");
  }

//Return the full order details
res.send(order);
});

export {getOrder, getOrderDetails}
