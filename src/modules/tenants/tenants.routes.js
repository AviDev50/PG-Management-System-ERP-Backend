import express from "express";
import upload from "../../common/config/upload.js";

import {
  createTenant,
  getTenantCountByBranch,
  getTenants,
  vacateTenant,
  getTenantById,
  updateTenant,
  deleteTenant,
  loginTenant,
} from "./tenants.controller.js";

import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { allowRoles } from "../../common/middlewares/role.middleware.js";

const router = express.Router();

/*--------------Create Tenant-----------*/

router.post(
  "/create",
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "document_image", maxCount: 2 },
  ]),
  createTenant,
);

/*--------------Get Tenants-----------*/

router.get("/", getTenants);

/*--------------Vacate Tenant (jb koi tenant chla jata h to status update ke liye nhi to occupayi show krega always)-----------*/

router.put("/vacate/:id", vacateTenant);

/*-------get Tenant By branch id------------*/

router.get("/branch/:branch_id", getTenantCountByBranch);
/*-------Get Tenant By ID------------*/

router.get("/:tenant_id", getTenantById);

/*--------------Update Tenant-----------*/

router.put(
  "/:tenant_id",
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "document_image", maxCount: 1 },
  ]),
  updateTenant,
);

/*--------------Delete Tenant-----------*/

router.delete("/:tenant_id", deleteTenant);

/*-------Tenant Login-------*/
router.post("/login", loginTenant);

export default router;
