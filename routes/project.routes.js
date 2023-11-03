import { signUp, logIn } from "../controllers/auth.controller.js";

import { Router } from "express";

const router = Router();

router.post("/signup", signUp);
router.post("/login", logIn);
export default router;

