import express from 'express'
import cors from 'cors'


//Import Routes
import userRouter from './routes/user.router.js'

//Initialization
const app = express();


//Middleware
app.use(express.json())
app.use(cors());

app.use("/api/v2/users", userRouter)

export {app}