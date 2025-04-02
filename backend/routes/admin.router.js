import express from 'express'
import {admin, adduserAdmin, updateuserAdmin, deleteUser} from '../controllers/admin.controller.js'
import { checkAdmin, checkAuth } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get("/", checkAuth, checkAdmin, admin);
router.post("/", checkAuth, checkAdmin, adduserAdmin)
router.put("/:id", checkAuth, checkAdmin, updateuserAdmin);
router.delete("/:id", checkAuth, checkAdmin, deleteUser)

export default router