import { Router } from "express";
const router = Router();

import {
  getAllTenants,
  getTenant,
  createTenant,
  updateTenant,
  deleteTenant,
  //showStats,
} from "../controllers/tenantController.js";
//import {
  //validateJobInput,
  //validateIdParam,
//} from "../middleware/validationMiddleware.js";
//import { checkForTestUser } from "../middleware/authMiddleware.js";
// router.get('/', getAllJobs);
// router.post('/', createJob);

router
  .route("/")
  .get(getAllTenants)
  .post(createTenant);
router.route("/stats");
router
  .route("/:id")
  .get( getTenant)
  .patch( updateTenant)
  .delete( deleteTenant);

export default router;
