import User from "../models/user.model.js";


// @desc register new user
// @route /api/v2/users/register
// @access public
const register = async (req, res, next) => {
     try{
     let { email, password } = req.body;
     let userexists = await User.findOne({ email });
     if (userexists) {
       let err = new Error(`User with email ${email} already exists!`);
       err.status = 400;
       throw err;
     }
   
     let user = await User.create(req.body);
     res.send({
       message: "User registered!",
       user: {
         name: user.name,
         email: user.email,
         role: user.role,
       },
     });
     }catch(err){
          next(err)
     }
}


//@desc login
//@route /api/v2/users/login
//access public
const login = async(req, res)=>{
     let {email, password}= req.body;
     let user = await User.findOne({email});
     if(!user){
          let err = new Error(`${email} not registered!`);
          err.status =400;
          throw err;
     }
     if(await user.matchPassword(password)){
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
}


export {register, login}