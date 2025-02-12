import products from "./data/products.js";
import users from "./data/users.js";
import Products from "./models/products.model.js";
import User from "./models/user.model.js";
import connectDb from "./config/db.js"
import dotenv from "dotenv";
import colors from "colors"


dotenv.config();

connectDb();

async function importData() {
  try {
    await User.deleteMany();
    await Products.deleteMany();

    let newusers = await User.insertMany(users);
    await Products.insertMany(
      products.map((products) => {
        return {
          ...products,
          user: newusers[0]._id,
        };
      })
    );
    console.log("Data Loaded!".green.inverse);
    process.exit();
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}

async function destroyData() {
  try {
    await User.deleteMany();
    await Products.deleteMany();
    console.log("Data Cleared!".red.inverse);
    process.exit();
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}
if (process.argv[2] == "-d") {
  destroyData();
} else {
  importData();
}
