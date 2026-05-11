import dotenv from "dotenv";

dotenv.config();

const ENV = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL || "",
  SALT_BYCRYPT: Number(process.env.SALT_BYCRYPT) || 5,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES: process.env.JWT_EXPIRES || "",
  BASE_URL: process.env.BASE_URL || "http://localhost:3000",
};

export default ENV;
