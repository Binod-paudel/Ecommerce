import Subscriber from "../models/Subcriber.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import apiError from "../utils/apiError.js";

const subscribeUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new apiError(400, "Email is required");
  }

  // Check if the email is already subscribed
  const existingSubscriber = await Subscriber.findOne({ email });
  if (existingSubscriber) {
    throw new apiError(400, "Email is already subscribed");
  }

  // Create and save a new subscriber
  const newSubscriber = new Subscriber({ email });
  await newSubscriber.save();

  res.status(201).json({ message: "Successfully subscribed to the newsletter!" });
});

export default subscribeUser;
