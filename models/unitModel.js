import mongoose from "mongoose";
import { UNIT_TYPE } from "../utils/constants.js";

const UnitSchema = new mongoose.Schema(
  {
    unitName: { type: String, required: true },
    unitColor: { type: String, required: true },
    unitType: {
      type: String,
      enum: Object.values(UNIT_TYPE),
      default: UNIT_TYPE.ONEBEDROOM,
    },
    unitDescription: { type: String, required: true },
    unitLocation: {
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

export default mongoose.model("Unit", UnitSchema);
