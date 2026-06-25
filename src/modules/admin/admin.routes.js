    import express from "express";

    import { createAdmin } from "./admin.controller.js";

    import { verifyToken } from "../../common/middlewares/auth.middleware.js";

    import { allowRoles } from "../../common/middlewares/role.middleware.js";
    import { checkBranchAccess } from "../../common/middlewares/checkBranchAccess.middleware.js";

    const router = express.Router();

    router.post("/create", verifyToken, allowRoles("super_admin"), createAdmin);

    export default router;
