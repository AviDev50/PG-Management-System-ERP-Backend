// complaints.routes.js

import express from "express";

import {
  createComplaint,
  getComplaints,
  resolveComplaint,
  updateComplaint,
deleteComplaint,
} from "./complaints.controller.js";

const router = express.Router();

/*===========================================================================
| CREATE COMPLAINT
===========================================================================*/

router.post("/create", createComplaint);

/*===========================================================================
| GET COMPLAINTS
===========================================================================*/

router.get("/", getComplaints);

/*===========================================================================
| RESOLVE COMPLAINT
===========================================================================*/

router.put("/resolve/:id", resolveComplaint);

/*---------update Complaint--------*/
router.put("/:id", updateComplaint);

/*---------Delete Complaint--------*/

router.delete("/:id", deleteComplaint);

export default router;