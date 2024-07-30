import express from "express";
const app = express();

import mongoose from "mongoose";





const port = process.env.PORT || 5100;

try {
  await mongoose.connect(process.env.MONGO_URL);
   
     app.listen(port, () => {
       console.log(`server running on PORT ${port}....`);
     });
} catch (error) {
  console.log(error);
  process.exit(1);
