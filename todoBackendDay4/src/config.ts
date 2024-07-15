import dotenv from "dotenv";
dotenv.config();
const config = {
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET || "my_secret_key",
    accessTokenExpiryMS: "50000s",
    refreshTokenExpiryMS: "2000000s",
  },
};
export default config;
