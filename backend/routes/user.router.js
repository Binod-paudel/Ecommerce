import express from "express";
import { register, login, logout, getUsers , updateUserProfile, updateUser, deleteUser} from "../controllers/user.controller.js";
import {checkAuth, checkAdmin} from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/",checkAuth, checkAdmin, getUsers);
router.put("/", checkAuth, updateUserProfile);
router.put("/profile", checkAuth, updateUser);
router.delete("/profile", checkAuth, checkAdmin, deleteUser)

export default router;
