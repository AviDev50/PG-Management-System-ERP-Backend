import express from "express";

const router = express.Router();

import {
  createAmenity,
  getAmenities,
  getAmenityById,
  updateAmenity,
  deleteAmenity,
  assignRoomAmenity,
  getRoomAmenities,
} from "./amenities.controller.js";

import { verifyToken } from "../../common/middlewares/auth.middleware.js";

import { allowRoles } from "../../common/middlewares/role.middleware.js";

import { checkBranchAccess } from "../../common/middlewares/checkBranchAccess.middleware.js";

// Amenities
router.post("/create", verifyToken, allowRoles("super_admin"), createAmenity);

router.get("/list", getAmenities);

router.get("/:id", getAmenityById);

router.put(
  "/update/:id",
  verifyToken,
  allowRoles("super_admin"),
  updateAmenity,
);

router.delete(
  "/delete/:id",
  verifyToken,
  allowRoles("super_admin"),
  deleteAmenity,
);

// Room Amenities
router.post("/assign-room", assignRoomAmenity);

router.get("/room/:room_id", getRoomAmenities);

export default router;
