import express from "express";

import {
  createManager,
  getManagers,
  getSingleManager,
  updateManager,
  deleteManager,
} from "./managers.controller.js";

import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { checkBranchAccess } from "../../common/middlewares/checkBranchAccess.middleware.js";
import { allowRoles } from "../../common/middlewares/role.middleware.js";

const router = express.Router();

/*---------------- Create Manager ----------------*/
router.post(
  "/create",
  verifyToken,
  allowRoles("admin"),
  checkBranchAccess({ source: "body" }),
  createManager,
);

/*---------------- Get Managers ----------------*/
router.get("/", verifyToken, allowRoles("admin"), getManagers);

/*---------------- Get Single Manager ----------------*/
router.get(
  "/:id",
  verifyToken,
  allowRoles("admin"),
  checkBranchAccess({
    source: "params",
    table: "managers",
    idParam: "id",
    idColumn: "manager_id",
  }),
  getSingleManager,
);

/*---------------- Update Manager ----------------*/
router.put(
  "/update/:id",
  verifyToken,
  allowRoles("admin"),
  checkBranchAccess({
    source: "params",
    table: "managers",
    idParam: "id",
    idColumn: "manager_id",
  }),
  updateManager,
);

/*---------------- Delete Manager ----------------*/
router.delete(
  "/delete/:id",
  verifyToken,
  allowRoles("admin"),
  checkBranchAccess({
    source: "params",
    table: "managers",
    idParam: "id",
    idColumn: "manager_id",
  }),
  deleteManager,
);

export default router;