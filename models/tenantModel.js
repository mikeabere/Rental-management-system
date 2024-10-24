import mongoose from "mongoose";
import { GENDER } from "../utils/constants.js";

const TenantSchema = new mongoose.Schema(
  {
    tenantName: { type: String, required: true },
    tenantAge: { type: String, required: true },
    tenantID: {
      type: String,
      required: true,
    },
    Gender: {
      type: String,
      enum: Object.values(GENDER),
      default: GENDER.UNKNOWN,
    },
    tenantLocation: {
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

export default mongoose.model("Tenant", TenantSchema);
