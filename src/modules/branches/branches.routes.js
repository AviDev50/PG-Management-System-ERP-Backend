import express from "express";

import {
  createBranch,
  getBranches,
  getSingleBranch,
  updateBranch,
  deleteBranch,
  getBranchesByPropertyId,
  approveBranch,
} from "./branches.controller.js";
import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { allowRoles } from "../../common/middlewares/role.middleware.js";
import upload from "../../common/config/upload.js";
import { checkBranchAccess } from "../../common/middlewares/checkBranchAccess.middleware.js";

const router = express.Router();

/*--------------Create Branch-----------*/
router.post(
  "/create",
  upload.any(),
  createBranch
);

/*--------------Get Branches-----------*/
router.get("/", getBranches);

/*--------------Get Single Branch-----------*/
router.get("/:id", getSingleBranch);

/*--------------Update Branch-----------*/
router.put(
  "/update/:id",
  upload.array("branch_photos", 10),
  updateBranch
);
/*--------------Delete Branch-----------*/
router.delete("/delete/:id", deleteBranch);

/*---------Get Branches By Property id-----*/

router.get("/property/:property_id", getBranchesByPropertyId);

/*--------------Approve Branch-----------*/

router.put(
  "/approve/:id",
  verifyToken,
  allowRoles("super_admin"),
  approveBranch,
);

export default router;
