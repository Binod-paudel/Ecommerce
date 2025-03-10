import Checkout from "../models/checkout.model.js";
import Products from "../models/products.model.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import apiError from "../utils/apiError.js";

//@desc Create a new checkout session
//@route POST /api/v2/checkout
//@access Private
const createCheckout = asyncHandler(async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;
    
    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ message: "No items in checkout" });
    }

    // Create a new checkout session
    const newCheckout = await Checkout.create({
        user: req.user._id,
        checkoutItems,
        shippingAddress,
        paymentMethod,
        totalPrice,
        paymentStatus: "Pending",
        isPaid: false,
    });

    console.log(`Checkout created for user: ${req.user._id}`);
    res.status(201).json(newCheckout);
});

//@desc Update checkout to mark as paid after successful payment
//@route PUT /api/checkout/:id/pay
//@access Private
const updateCheckout = asyncHandler(async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;
    const checkout = await Checkout.findById(req.params.id);
    
    if (!checkout) {
        throw new apiError(404, "Checkout not found");
    }

    if (paymentStatus === "paid") {
        checkout.isPaid = true;
        checkout.paymentStatus = paymentStatus;
        checkout.paymentDetails = paymentDetails;
        checkout.paidAt = Date.now();
        
        await checkout.save();
        res.status(200).json(checkout);
    } else {
        res.status(400).json({ message: "Invalid payment status" });
    }
});

//@desc Finalize checkout and convert to an order after payment confirmation
//@route POST /api/v2/checkout/:id/finalize
//@access Private
const finalizeCheckout = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const checkout = await Checkout.findById(id);
    
    if (!checkout) {
        throw new apiError(404, "Checkout not found");
    }

    if (checkout.isPaid && !checkout.isFinalized) {
        // Create final order based on checkout details
        const finalOrder = await Order.create({
            user: checkout.user,
            orderItems: checkout.checkoutItems, // Fixed from checkout.orderItems
            shippingAddress: checkout.shippingAddress,
            paymentMethod: checkout.paymentMethod,
            totalPrice: checkout.totalPrice,
            isPaid: true,
            paidAt: checkout.paidAt,
            isDelivered: false,
            paymentStatus: "paid",
            paymentDetails: checkout.paymentDetails,
        });

        // Mark checkout as finalized
        checkout.isFinalized = true;
        checkout.finalizedAt = Date.now();
        await checkout.save();

        // Delete the cart associated with the user
        await Cart.findOneAndDelete({ user: checkout.user });
        res.status(201).json(finalOrder);
    } else if (checkout.isFinalized) {
        res.status(400).json({ message: "Checkout already finalized" });
    } else {
        res.status(400).json({ message: "Checkout is not paid" });
    }
});

export { createCheckout, updateCheckout, finalizeCheckout };
