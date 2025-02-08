import { app } from "./app.js";
import connectDb from "./config/db.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 8000;

// Connect to the database before starting the server
connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server is up and running at PORT ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database connection failed!", err);
        process.exit(1); // Exit process on DB connection failure
    });
