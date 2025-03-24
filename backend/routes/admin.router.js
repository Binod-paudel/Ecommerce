import express from 'express'
import {admin, adduserAdmin} from '../controllers/admin.controller.js'
import { checkAdmin, checkAuth } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get("/", checkAuth, checkAdmin, admin);
router.post("/", checkAuth, checkAdmin, adduserAdmin)

export default router