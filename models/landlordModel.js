import mongoose from "mongoose";
import { GENDER } from "../utils/constants.js";

const LandlordSchema = new mongoose.Schema(
  {
    landlordName: { type: String, required: true },
    landlordAge: { type: String, required: true },
    landlordID: {
      type: String,
      required: true,
    },
    Gender: {
      type: String,
      enum: Object.values(GENDER),
      default: GENDER.UNKNOWN,
    },
    landlordLocation: {
      type: String,
      default: "Nairobi",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Landlord", LandlordSchema);
