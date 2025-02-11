import User from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import createToken from "../utils/token.utils.js";
import apiError from "../utils/apiError.js";
import {isEmail, isStrongPassword} from "../utils/validator.js"


// @desc register new user
// @route /api/v2/users/register
// @access public
const register = asyncHandler(async (req, res, next) => {
     let { email, password } = req.body;
     if (!isEmail(email)) {
          throw new apiError(400, "Invalid Email!");
        }
        if (!isStrongPassword(password)) {
          throw new apiError(
            400,
            "Password must have atealst 1 uppercase, 1 lowercase, 1 digit and 1 special character!"
          );
        }
     let userexists = await User.findOne({ email });
     if (userexists) {
       let err = new Error(`User with email ${email} already exists!`);
       err.status = 400;
       throw err;
     }
   
     let user = await User.create(req.body);
     createToken(res, user._id)
     res.send({
       message: "User registered!",
       user: {
         name: user.name,
         email: user.email,
         role: user.role,
       },
     });
});


//@desc login
//@route /api/v2/users/login
//access public
const login = asyncHandler(async(req, res)=>{
     let {email, password}= req.body;
     let user = await User.findOne({email});
     if(!user){
          let err = new Error(`${email} not registered!`);
          err.status =400;
          throw err;
     }
     if(await user.matchPassword(password)){
          createToken(res, user._id)
          res.send({
               message: "Login Successful!",
               user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
               }
          })
     }else{
          let err = new Error("Invalid Password");
          err.status = 400;
          throw err
     }
});

const logout = asyncHandler(async(req, res)=>{
     res.clearCookie("jwt");
     res.send({message: "logout successfully!"})
})


// @desc get all users
// @route /api/v2/users
// @access private + admin user
const getUsers = asyncHandler(async (req, res) => {
     let users = await User.find({}).select("-password");
     res.send(users);
   });
   
// @desc get user profile
// @route /api/v2/users/profile
// @access private

const getUserProfile = asyncHandler(async(req, res)=>{
     res.send(req.user)
})


// @desc udpate user profile
// @route /api/users/profile
// @access private
const updateUserProfile = asyncHandler(async(req, res)=>{
     let id = req.user._id;
     let user = await User.findById(id);
     if(user){
          user.name = req.body.name || user.name,
          user.email = req.body.email || user.email
          if(req.body.password)user.password = req.body.password;
          let updatedUser = await user.save();
          res.send({
               message: "User profile Updated!",
               user: {
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role
               }
          });
     }else{
          let err = new Error("User not found!");
          err.status=404;
          throw err;
     }
})

const updateUser = asyncHandler(async(req, res)=>{
     let id = req.params.id;
     let user = await User.findById(id);
     if(user){
          user.name= req.body.name || user.name;
          user.email = req.body.email || user.email;
          user.role = req.body.role || user.role;
          let updatedUser = await user.save();
          res.send({message : "User is updated", user: updatedUser})
     }else{
          throw new apiError(404, "User not Found!")
     }
})

const deleteUser = asyncHandler(async(req, res)=>{
     let id = req.params.id;
     let user = await User.findById(id);
     if(user.role === "admin"){
          let err = new Error("Cannot delete an admin user");
          err.status = 400;
          throw err;
     }
     await User.findByIdAndDelete(id);
     res.send({message: "User deleted successfully!"});
});


export {register, login, logout, getUsers, updateUserProfile, updateUser, deleteUser}