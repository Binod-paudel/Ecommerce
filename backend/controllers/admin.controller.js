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
  res.status(201).json({ message: "User created successfully", user });
});

//@route PUT /api/admin/users/:id
//@desc Update user info (admin only) - Name, email and role
//@access Private /Admin

const updateuserAdmin = asyncHandler(async (req, res) => {
  let user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.role = req.body.role || user.role;
    user.email = req.body.email || user.email;
  }
  let updatedUseradmin = await user.save();
  res.json({ message: "User updated successfully", user: updatedUseradmin });
});

//@route DELETE /api/admin/users/:id
//@desc Delete a user 
//@access Private / Admin


const deleteUser = asyncHandler(async(req, res)=>{
  let user = await User.findById(req.params.id);
  if(user){
    await user.deleteOne();
    res.json({message: "User deleted successfully"})
  }else{
    res.stauts(404).json({message: "User not found"});
  }
})

export { admin, adduserAdmin, updateuserAdmin, deleteUser};
