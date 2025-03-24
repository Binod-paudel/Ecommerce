import User from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import apiError from "../utils/apiError.js";

//@route GET/api/v2/admin/users
//@access private
const admin = asyncHandler(async (req, res) => {
  let users = await User.find({});
  res.send(users);
});

//@route POST /api/v2/admin/users
//@desc Add a new user {admin only}
//@access private + admin

const adduserAdmin = asyncHandler(async (req, res) => {
  let { name, email, password, role } = req.body;
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  user = new User({
    name,
    email,
    password,
    role: role || "customer",
  });
  await user.save();
  res.status(201).json({ message: "User created successfully" , user});
});

export { admin, adduserAdmin };
