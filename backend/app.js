import express from 'express'
import cors from 'cors'
import logger from './middlewares/logger.middleware.js';
import errorHandler from './middlewares/error.middleware.js';
import notFoundHandler from './middlewares/notFound.middleware.js';
import cookieParser from 'cookie-parser';


//Import Routes
import userRouter from './routes/user.router.js';
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.route.js'
import checkoutRouter from './routes/checkout.router.js'
import orderRouter from './routes/order.router.js'
import uploadRouter from './routes/upload.Router.js'


//Initialization
const app = express();


//Middleware
app.use(cookieParser()); // Ensure this is added BEFORE using checkAuth
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(logger);

app.use("/api/v2/users", userRouter);
app.use("/api/v2/products", productRouter);
app.use("/api/v2/cart", cartRouter);
app.use("/api/v2/checkout", checkoutRouter);
app.use("/api/v2/orders", orderRouter);
app.use("/api/v2/uploads", uploadRouter);

app.use(errorHandler)
app.use(notFoundHandler)

export {app}