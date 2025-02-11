import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import asyncHandler from "./asyncHandler.js";

const checkAuth = asyncHandler(async (req, res, next) => {
    let token = req.cookies.jwt;
    console.log(token);
    if (!token) {
        let err = new Error("You must be logged in!");
        err.status = 401;
        throw err;
    }
    
    try {
        let { userId } = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(userId);
        
        if (!user) {
            let err = new Error("User not found!");
            err.status = 404;
            throw err;
        }

        req.user = {
            name: user.name,
            email: user.email,
            role: user.role,
        };
        next();
    } catch (e) {
        let err = new Error("Invalid token!");
        err.status = 401;
        throw err;
    }
});

const checkAdmin = asyncHandler(async (req, res, next) => {
    if (req.user?.role === "admin") {
        next();
    } else {
        let err = new Error("You are not authorized to perform this operation");
        err.status = 403;
        throw err;
    }
});

export { checkAuth, checkAdmin };
