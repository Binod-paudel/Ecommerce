import User from "../models/user.model.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import createToken from "../utils/token.utils.js";


// @desc register new user
// @route /api/v2/users/register
// @access public
const register = asyncHandler(async (req, res, next) => {
     let { email, password } = req.body;
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


//@desc get all users
//@route /api/v2/users
//@private + admin
const getUser = asyncHandler(async(req, res)=>{
     let users = await User.find({}).select(-password);
     res.send(users)
})


export {register, login, logout, getUser}