import express from "express";

import {
  createTenant,
  getTenantCountByBranch,
  getTenants,
  vacateTenant,
  getTenantById
} from "./tenants.controller.js";

const router = express.Router();

/*--------------Create Tenant-----------*/

router.post("/create", createTenant);

/*--------------Get Tenants-----------*/

router.get("/", getTenants);

/*--------------Vacate Tenant (jb koi tenant chla jata h to status update ke liye nhi to occupayi show krega always)-----------*/

router.put("/vacate/:id", vacateTenant);


/*-------get Tenant By branch id------------*/

router.get("/branch/:branch_id", getTenantCountByBranch);
/*-------Get Tenant By ID------------*/

router.get("/:tenant_id", getTenantById);

export default router;
