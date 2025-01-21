import mongoose from "mongoose";


const rentSchema = new mongoose.Schema(
  {
 
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Rent", rentSchema);