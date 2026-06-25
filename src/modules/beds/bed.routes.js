import express from "express";

import {
  createBed,
  getBeds,
  getSingleBed,
  updateBed,
  deleteBed,
} from "./bed.controller.js";

const router = express.Router();
import {checkBranchAccess} from "../../common/middlewares/checkBranchAccess.middleware.js";

/*--------------Create Bed-----------*/
router.post("/create", createBed);

/*--------------Get Beds-----------*/
router.get("/", getBeds);

/*--------------Get Single Bed-----------*/
router.get("/:id", getSingleBed);

/*--------------Update Bed-----------*/
router.put("/update/:id", updateBed);

/*--------------Delete Bed-----------*/
router.delete("/delete/:id", deleteBed);

export default router;
