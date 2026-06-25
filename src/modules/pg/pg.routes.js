import express from "express";

import {
  createProperty,
  getApprovedProperties,
  getSingleProperty,
  updateProperty,
  deleteProperty,
  approveProperty,
} from "./pg.controller.js";

import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { allowRoles } from "../../common/middlewares/role.middleware.js";
import {checkBranchAccess} from "../../common/middlewares/checkBranchAccess.middleware.js";

const router = express.Router();

/*------------------Create PG-------------*/
router.post("/create", createProperty);

/*------------------Get All PG-------------*/
router.get("/", getApprovedProperties);

/*------------------Get Single PG-------------*/
router.get("/:id", getSingleProperty);

/*------------------Update PG-------------*/
router.put("/update/:id", updateProperty);

/*------------------Delete PG-------------*/
router.delete("/delete/:id", deleteProperty);

/*------------------Approve PG-------------*/
router.put(
  "/approve/:id",
  verifyToken,
  allowRoles("super_admin"),
  approveProperty,
);

export default router;
