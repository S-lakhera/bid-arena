import dotenv from "dotenv";

dotenv.config();

const envConfig = Object.freeze({
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
});

export default envConfig;
