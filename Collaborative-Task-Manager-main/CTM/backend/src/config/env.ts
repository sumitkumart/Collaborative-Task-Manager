import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: parseInt(process.env.PORT || "4000", 10),
  mongoUri:
    process.env.MONGO_URI ||
    "mongodb+srv://sumitkumartiwari627_db_user:v3hPSBknX403GVSV@cluster0.2tj59wn.mongodb.net/",
  jwtSecret: process.env.JWT_SECRET || "dev_secret",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  cookieName: process.env.COOKIE_NAME || "taskmgr_token",
  nodeEnv: process.env.NODE_ENV || "development",
};
