import express from "express";

import {
  createManager,
  getManagers,
  getSingleManager,
  updateManager,
  deleteManager,
  getManagerPermissions,
  updateManagerPermissions,
} from "./managers.controller.js";

import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { checkBranchAccess } from "../../common/middlewares/checkBranchAccess.middleware.js";

import { allowRoles } from "../../common/middlewares/role.middleware.js";

const router = express.Router();

/*---------------- Create Manager ----------------*/
router.post("/create", verifyToken, allowRoles("admin"), createManager);

/*---------------- Get Managers ----------------*/
router.get("/", verifyToken, allowRoles("admin"), getManagers);

/*---------------- Get Single Manager ----------------*/
router.get("/:id", verifyToken, allowRoles("admin"), getSingleManager);

/*---------------- Update Manager ----------------*/
router.put("/update/:id", verifyToken, allowRoles("admin"), updateManager);

/*---------------- Delete Manager ----------------*/
router.delete("/delete/:id", verifyToken, allowRoles("admin"), deleteManager);

/*---------------- Get Manager Permissions ----------------*/
router.get(
  "/permissions/:managerId",
  verifyToken,
  allowRoles("admin"),
  getManagerPermissions,
);

/*---------------- Update Manager Permissions ----------------*/
router.put(
  "/permissions/:managerId",
  verifyToken,
  allowRoles("admin"),
  updateManagerPermissions,
);

export default router;
