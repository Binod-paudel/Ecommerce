import Order from "../models/order.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";

//@route GET /api/v2/admin/orders
//@desc get all order (admin only)
//@access Private/Admin

const getOrders = asyncHandler(async (req, res) => {
  let orders = await Order.find({}).populate("user", "name email");
  res.send(orders);
});

//@route PUT /api/admin/orders/:id
//@desc Update order status
//@access Private/Admin
const upateOrderStatus = asyncHandler(async (req, res) => {
  let order = await Order.findById(req.params.id);
  if (order) {
    order.status = req.body.status || order.status;
    order.isDelivered =
      req.body.status === "Delivered" ? true : order.isDelivered;
    order.deliveredAt =
      req.body.status === "Delivered" ? Date.now() : order.deliveredAt;

    let updatedOrder = await order.save();
    res.json(updatedOrder);
  }
});

//@route DELETE /api/admin/orders/:id
//@desc Delete an order
//@access Private/Admin

const deleteOrder = asyncHandler(async (req, res) => {
  let order = await Order.findById(req.params.id);
  if (order) {
    await order.deleteOne();
    res.json({ message: "Order removed" });
  } else {
    res.status(404).json({ message: "Order not found" });
  }
});

export { getOrders, upateOrderStatus, deleteOrder };
