import Unit from "../models/unitModel.js";
import { StatusCodes } from "http-status-codes";

export const getAllUnits = async (req, res) => {
  const units = await Unit.find({});
  res.status(StatusCodes.OK).json({ units });
};

export const createUnit = async (req, res) => {
  //req.body.createdBy = req.user.userId;
  const unit = await Unit.create(req.body);
  res.status(StatusCodes.CREATED).json({ unit });
};

export const getUnit = async (req, res) => {
  const unit = await Unit.findById(req.params.id);

  res.status(StatusCodes.OK).json({ unit });
};

export const updateUnit = async (req, res) => {
  const updatedUnit = await Unit.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res
    .status(StatusCodes.OK)
    .json({ msg: "unit modified", unit: updatedUnit });
};

export const deleteUnit = async (req, res) => {
  const removedUnit = await Unit.findByIdAndDelete(req.params.id);
  res
    .status(StatusCodes.OK)
    .json({ msg: "unit deleted", unit: removedUnit });
};
