import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();

//import cors from "cors";

import mongoose from "mongoose";
import cookieParser from "cookie-parser";



import tenantRouter from "./routes/tenantRouter.js";
import unitRouter from "./routes/unitRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";

//middleware
import { authenticateUser } from "./middleware/authMiddleware.js";

//app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/tenants", tenantRouter);
app.use("/api/v1/units", unitRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users",authenticateUser, userRouter);







const port = process.env.PORT || 6000;

try {
  await mongoose.connect(process.env.MONGO_URL);

  app.listen(port, () => {
    console.log(`server running on PORT ${port}....`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
