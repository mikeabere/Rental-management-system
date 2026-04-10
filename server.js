import "express-async-errors"; 
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();

import connectDB from "./config/db.js";
connectDB(); 

import cors from "cors";


import cookieParser from "cookie-parser";
import helmet from "helmet";



import paymentRouter from "./routes/paymentRoutes.js";
import propertyRouter from "./routes/propertyRoutes.js";
import leaseRouter from "./routes/leaseRoutes.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import mpesaRouter from "./routes/mpesaRoutes.js";

//middleware
import { authenticateUser } from "./middleware/authMiddleware.js";

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/properties", propertyRouter);
app.use("/api/v1/leases", leaseRouter);
app.use("/mpesa", mpesaRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users",authenticateUser, userRouter);

// Health check
app.get('/', (req, res) => res.json({ message: '🏠 Rental Management Backend Running - Kenya Edition' }));


const PORT = process.env.PORT || 6000;

app.listen( PORT, ()=> {
   console.log(`🚀 Server running on port ${PORT}`);
});


