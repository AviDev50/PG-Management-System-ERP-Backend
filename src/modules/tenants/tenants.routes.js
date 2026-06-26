import express from "express";
import upload from "../../common/config/upload.js";

import {
  createTenant,
  getTenantCountByBranch,
  getTenants,
  vacateTenant,
  getTenantById,
  getTenantDetailsTenantSide,
  updateTenant,
  deleteTenant,
} from "./tenants.controller.js";

import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { verifyTenantToken } from "../../common/middlewares/tenantauth.middleware.js";
import { allowRoles } from "../../common/middlewares/role.middleware.js";
import { checkBranchAccess } from "../../common/middlewares/checkBranchAccess.middleware.js";

const router = express.Router();

/*--------------Create Tenant-----------*/

router.post(
  "/create",
  verifyToken,
  allowRoles("admin"),
  checkBranchAccess({ source: "body" }),
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "document_image", maxCount: 2 },
  ]),
  createTenant,
);

/*--------------Get Tenants-----------*/

router.get("/", verifyToken, allowRoles("admin"), getTenants);

/*--------------Vacate Tenant (status update, taaki occupancy sahi dikhe)-----------*/

router.put(
  "/vacate/:id",
  verifyToken,
  allowRoles("admin"),
  checkBranchAccess({
    source: "params",
    table: "tenants",
    idParam: "id",
    idColumn: "tenant_id",
  }),
  vacateTenant,
);

/*-------get Tenant By branch id------------*/

router.get(
  "/branch/:branch_id",
  verifyToken,
  allowRoles("admin"),
  checkBranchAccess({
    source: "params",
    table: "branches",
    idParam: "branch_id",
    idColumn: "branch_id",
  }),
  getTenantCountByBranch,
);

/*-------Get Own Details (TENANT SIDE)------------*/

router.get("/me", verifyTenantToken, getTenantDetailsTenantSide);

/*-------Get Tenant By ID (ADMIN SIDE)------------*/

router.get(
  "/:tenant_id",
  verifyToken,
  allowRoles("admin"),
  checkBranchAccess({
    source: "params",
    table: "tenants",
    idParam: "tenant_id",
    idColumn: "tenant_id",
  }),
  getTenantById,
);

/*--------------Update Tenant-----------*/

router.put(
  "/:tenant_id",
  verifyToken,
  allowRoles("admin"),
  checkBranchAccess({
    source: "params",
    table: "tenants",
    idParam: "tenant_id",
    idColumn: "tenant_id",
  }),
  upload.fields([
    { name: "profile_image", maxCount: 1 },
    { name: "document_image", maxCount: 1 },
  ]),
  updateTenant,
);

/*--------------Delete Tenant-----------*/

router.delete(
  "/:tenant_id",
  verifyToken,
  allowRoles("admin"),
  checkBranchAccess({
    source: "params",
    table: "tenants",
    idParam: "tenant_id",
    idColumn: "tenant_id",
  }),
  deleteTenant,
);

export default router;