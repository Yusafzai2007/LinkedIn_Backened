import mongoose from "mongoose";
import { DB_Name } from "../constant.js";

const connectdb = async () => {
  try {
    const response = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_Name}`,
    );
    console.log(`mongodb connect ${process.env.MONGODB_URL}/${DB_Name}`);
    return response;
  } catch (error) {
    console.log(`mongodb connection erro ${error}`);
  }
};

export { connectdb };
