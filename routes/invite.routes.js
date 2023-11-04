import { viewInvites, acceptInvites, sendInvites } from "../controller/invite.controller.js";

import { Router } from "express";

const router = Router();

router.get("/view", viewInvites);
router.post("/accept/:id", acceptInvites);
router.post("/send/:id", sendInvites);

export default router;