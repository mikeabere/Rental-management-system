import Landlord from "../models/landlordModel.js";
import { StatusCodes } from "http-status-codes";

export const getAllLandlords = async (req, res) => {
  const landlords = await Landlord.find({});
  res.status(StatusCodes.OK).json({ landlords });
};

export const createLandlord = async (req, res) => {
  //req.body.createdBy = req.user.userId;
  const landlord = await Landlord.create(req.body);
  res.status(StatusCodes.CREATED).json({ landlord });
};

export const getLandlord = async (req, res) => {
  const landlord = await Landlord.findById(req.params.id);

  res.status(StatusCodes.OK).json({ landlord });
};

export const updateLandlord = async (req, res) => {
  const updatedLandlord = await Landlord.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res
    .status(StatusCodes.OK)
    .json({ msg: "landlord modified", landlord: updatedLandlord });
};

export const deleteLandlord = async (req, res) => {
  const removedLandlord = await Landlord.findByIdAndDelete(req.params.id);
  res
    .status(StatusCodes.OK)
    .json({ msg: "tenant deleted", landlord: removedLandlord });
};