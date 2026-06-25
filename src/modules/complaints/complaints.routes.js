import express from "express";

import {
  createComplaint,
  getComplaints,
  resolveComplaint,
  updateComplaint,
  deleteComplaint,
  getComplaintCountByBranch,
} from "./complaints.controller.js";
import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { checkBranchAccess } from "../../common/middlewares/checkBranchAccess.middleware.js";

const router = express.Router();

/*===========================================================================
| CREATE COMPLAINT
===========================================================================*/

router.post("/create", verifyToken ,checkBranchAccess, createComplaint);

/*===========================================================================
| GET COMPLAINTS
===========================================================================*/

router.get("/", verifyToken, getComplaints);

/*===========================================================================
| RESOLVE COMPLAINT
===========================================================================*/

router.put("/resolve/:id", resolveComplaint);

/*---------update Complaint--------*/

router.put("/:id", updateComplaint);

/*---------Delete Complaint--------*/

router.delete("/:id", deleteComplaint);

/*---------get complaint by branch id---------*/

router.get("/branch/:branch_id", verifyToken, getComplaintCountByBranch);

export default router;
