import express from "express";
import { checkBranchAccess } from "../../common/middlewares/checkBranchAccess.middleware.js";

const router = express.Router();

import {
  addElectricityReading,
  getElectricityReadings,
  generateTenantBills,
  getTenantBills,
  markBillPaid,
} from "./electricity.controller.js";

/*--------------------- Create Electricity Reading---------*/

router.post("/readings", addElectricityReading);

/*--------------------- Get All Electricity Readings--------------*/

router.get("/readings", getElectricityReadings);

/*----------------------Generate Tenant Bills----------------------*/

router.post("/readings/:reading_id/generate-bills", generateTenantBills);

/*----------------------Get All Tenant Bills------------------------*/
router.get("/bills", getTenantBills);

/*--------------------Mark Bill As Paid------------------------------*/

router.put("/bills/:bill_id/pay", markBillPaid);

export default router;
