import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const clientUrl = process.env.CLIENT_URL;

if (nodeEnv === "production" && !clientUrl) {
  throw new Error("CLIENT_URL must be defined in production");
}

const resolvedClientUrl = clientUrl || "http://localhost:3000";

const envConfig = Object.freeze({
  PORT: process.env.PORT || 5000,
  NODE_ENV: nodeEnv,
  MONGO_URI: process.env.MONGO_URI,
  CLIENT_URL: resolvedClientUrl,
  ALLOWED_ORIGINS: nodeEnv === "production" ? [resolvedClientUrl] : [resolvedClientUrl, "http://127.0.0.1:3000"],
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
});

export default envConfig;
