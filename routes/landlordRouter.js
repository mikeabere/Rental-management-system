import { Router } from "express";
const router = Router();

import {
  getAllLandlords,
  getLandlord,
  createLandlord,
  updateLandlord,
  deleteLandlord,
 
} from "../controllers/landlordController.js";


router.route("/").get(getAllLandlords).post(createLandlord);
//router.route("/stats");
router.route("/:id").get(getLandlord).patch(updateLandlord).delete(deleteLandlord);

export default router;
