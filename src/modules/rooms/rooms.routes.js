// import express from "express";

// import {
//   createRoom,
//   getRooms,
//   getSingleRoom,
//   updateRoom,
//   deleteRoom,
//   getRoomsByBranch,
// } from "./rooms.controller.js";

// const router = express.Router();

// /*------------------Create Room-------------*/
// router.post("/create", createRoom);

// /*------------------Get Rooms-------------*/
// router.get("/", getRooms);

// /*------------------Get Single Room-------------*/
// router.get("/:id", getSingleRoom);

// /*------------------Update Room-------------*/
// router.put("/update/:id", updateRoom);

// /*------------------Delete Room-------------*/
// router.delete("/delete/:id", deleteRoom);

// /*-----------Get Data Behalf of branch id------------*/
// router.get("/branch/:branch_id", getRoomsByBranch);

// export default router;

import express from "express";

import {
  createRoom,
  getRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  getRoomsByBranch,
} from "./rooms.controller.js";

import { verifyToken } from "../../common/middlewares/auth.middleware.js";
import { allowRoles } from "../../common/middlewares/role.middleware.js";
import { checkPermission } from "../../common/middlewares/permission.middleware.js";

const router = express.Router();

/*------------------Create Room-------------*/
router.post(
  "/create",
  verifyToken,
  allowRoles("admin", "branch_manager"),
  checkPermission("rooms"),
  createRoom,
);

/*------------------Get Rooms-------------*/
router.get(
  "/",
  verifyToken,
  allowRoles("admin", "branch_manager"),
  checkPermission("rooms"),
  getRooms,
);

/*------------------Get Single Room-------------*/
router.get(
  "/:id",
  verifyToken,
  allowRoles("admin", "branch_manager"),
  checkPermission("rooms"),
  getSingleRoom,
);

/*------------------Update Room-------------*/
router.put(
  "/update/:id",
  verifyToken,
  allowRoles("admin", "branch_manager"),
  checkPermission("rooms"),
  updateRoom,
);

/*------------------Delete Room-------------*/
router.delete(
  "/delete/:id",
  verifyToken,
  allowRoles("admin", "branch_manager"),
  checkPermission("rooms"),
  deleteRoom,
);

/*-----------Get Data Behalf of branch id------------*/
router.get(
  "/branch/:branch_id",
  verifyToken,
  allowRoles("admin", "branch_manager"),
  checkPermission("rooms"),
  getRoomsByBranch,
);

export default router;
