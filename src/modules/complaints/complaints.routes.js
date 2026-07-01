import express from "express";

import {
  createComplaint,
  getComplaints,
  resolveComplaint,
  deleteComplaint,
  getComplaintByBranchId,
} from "./complaints.controller.js";
import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { checkBranchAccess } from "../../common/middlewares/checkBranchAccess.middleware.js";

const router = express.Router();

/*===========================================================================
| CREATE COMPLAINT
===========================================================================*/

router.post("/create", verifyToken, createComplaint);

/*===========================================================================
| GET COMPLAINTS
===========================================================================*/

router.get("/", verifyToken, getComplaints);

/*===========================================================================
| RESOLVE COMPLAINT
===========================================================================*/

router.put("/resolve/:id", verifyToken, resolveComplaint);

/*---------Delete Complaint--------*/

router.delete("/:id", verifyToken, deleteComplaint);

/*---------Get complaints by branch id---------*/

router.get(
  "/branch/:branch_id",
  verifyToken,
  checkBranchAccess({
    source: "params",
    table: "branches",
    idParam: "branch_id",
    idColumn: "branch_id",
  }),
  getComplaintByBranchId,
);

export default router;
