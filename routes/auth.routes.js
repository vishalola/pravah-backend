import { signUp, logIn, viewDetails } from "../controller/auth.controller.js";

import { Router } from "express";

const router = Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/detail/:id", viewDetails);
export default router;
