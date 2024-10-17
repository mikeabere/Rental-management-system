import { Router } from "express";
const router = Router();

import {
  getAllUnits,
  getUnit,
  createUnit,
  updateUnit,
  deleteUnit,
} from "../controllers/unitController.js";

router.route("/").get(getAllUnits).post(createUnit);
//router.route("/stats");
router
  .route("/:id")
  .get(getUnit)
  .patch(updateUnit)
  .delete(deleteUnit);

export default router;
