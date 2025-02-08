import express from 'express'
import cors from 'cors'
import logger from './middlewares/logger.middleware.js';
import errorHandler from './middlewares/error.middleware.js';


//Import Routes
import userRouter from './routes/user.router.js'

//Initialization
const app = express();


//Middleware
app.use(express.json())
app.use(cors());
app.use(logger);

app.use("/api/v2/users", userRouter)

app.use(errorHandler)

export {app}