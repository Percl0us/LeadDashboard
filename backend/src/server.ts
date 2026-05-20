import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";
dotenv.config();

const startup = async () => {
  try {
    await connectDB();
    app.listen(Number(process.env.PORT || 2000), () => {
      console.log(`Server is running on port ${process.env.PORT || 2000}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
startup();
