import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "./middlewares/logger.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import notFoundHandler from "./middlewares/notFound.middleware.js";

// Import Routes
import userRouter from "./routes/user.router.js";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.route.js";
import checkoutRouter from "./routes/checkout.router.js";
import orderRouter from "./routes/order.router.js";
import uploadRouter from "./routes/upload.Router.js";
import subscribeRouter from "./routes/subscribe.router.js";
import adminRouter from "./routes/admin.router.js";
import adminProductRouter from "./routes/product.admin.route.js";
import adminorderRouter from "./routes/admin.order.js";

// Initialization
const app = express();

// CORS middleware setup
app.use(
  cors({
    origin: "http://localhost:5173",  // Frontend URL
    credentials: true,  // Allow cookies to be sent with requests
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",  // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"],  // Allowed headers
  })
);

// Middleware
app.use(cookieParser());  // Ensure this is added before authentication-related routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);  // Logging middleware

// Routes
app.use("/api/v2/users", userRouter);
app.use("/api/v2/products", productRouter);
app.use("/api/v2/cart", cartRouter);
app.use("/api/v2/checkout", checkoutRouter);
app.use("/api/v2/orders", orderRouter);
app.use("/api/v2/uploads", uploadRouter);
app.use("/api/v2/subscriber", subscribeRouter);
app.use("/api/v2/admin/users", adminRouter);
app.use("/api/v2/admin/products", adminProductRouter);
app.use("/api/v2/admin/orders", adminorderRouter);

// Error handling
app.use(errorHandler);
app.use(notFoundHandler);

export { app };
