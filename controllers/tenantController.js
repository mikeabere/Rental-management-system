import Tenant from "../models/tenantModel.js";
import { StatusCodes } from "http-status-codes";
//import mongoose from "mongoose";
//import day from "dayjs";

export const getAllTenants = async (req, res) => {
  //const { search, jobStatus, jobType, sort } = req.query;

  //const queryObject = {
    //createdBy: req.user.userId,
  //};

  //if (search) {
    //queryObject.$or = [
      //{ position: { $regex: search, $options: "i" } },
      //{ company: { $regex: search, $options: "i" } },
    //];
  //}
  //if (jobStatus && jobStatus !== "all") {
    //queryObject.jobStatus = jobStatus;
  //}
  //if (jobType && jobType !== "all") {
    //queryObject.jobType = jobType;
  //}

  //const sortOptions = {
    //newest: "-createdAt",
    //oldest: "createdAt",
    //"a-z": "position",
    //"z-a": "-position",
  //};

  //const sortKey = sortOptions[sort] || sortOptions.newest;

  // setup pagination
  //const page = Number(req.query.page) || 1;
  //const limit = Number(req.query.limit) || 10;
  //const skip = (page - 1) * limit;

  const jobs = await Tenant.find({});
    //.sort(sortKey)
    //.skip(skip)
    //.limit(limit);

  //const totalJobs = await Tenant.countDocuments(queryObject);
  //const numOfPages = Math.ceil(totalJobs / limit);

  res
    .status(StatusCodes.OK)
    .json({ jobs });
};

export const createTenant = async (req, res) => {
  //req.body.createdBy = req.user.userId;
  const tenant = await Tenant.create(req.body);
  res.status(StatusCodes.CREATED).json({ tenant });
};

export const getTenant = async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);

  res.status(StatusCodes.OK).json({ tenant });
};

export const updateTenant = async (req, res) => {
  const updatedTenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(StatusCodes.OK).json({ msg: "tenant modified", job: updatedTenant });
};

export const deleteTenant = async (req, res) => {
  const removedTenant = await Tenant.findByIdAndDelete(req.params.id);
  res.status(StatusCodes.OK).json({ msg: "tenant deleted", job: removedTenant });
};

// export const showStats = async (req, res) => {
//   let stats = await Tenant.aggregate([
//     { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
//     { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
//   ]);
//   stats = stats.reduce((acc, curr) => {
//     const { _id: title, count } = curr;
//     acc[title] = count;
//     return acc;
//   }, {});

//   const defaultStats = {
//     pending: stats.pending || 0,
//     interview: stats.interview || 0,
//     declined: stats.declined || 0,
//   };

//   let monthlyApplications = await Job.aggregate([
//     { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
//     {
//       $group: {
//         _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
//         count: { $sum: 1 },
//       },
//     },
//     { $sort: { "_id.year": -1, "_id.month": -1 } },
//     { $limit: 6 },
//   ]);
//   monthlyApplications = monthlyApplications
//     .map((item) => {
//       const {
//         _id: { year, month },
//         count,
//       } = item;

//       const date = day()
//         .month(month - 1)
//         .year(year)
//         .format("MMM YY");
//       return { date, count };
//     })
//     .reverse();
//   res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
// };
