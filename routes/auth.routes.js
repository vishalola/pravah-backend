import { signUp, logIn } from "../controller/auth.controller.js";

import { Router } from "express";

const router = Router();

router.post("/signup", signUp);
router.post("/login", logIn);
export default router;
