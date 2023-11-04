import { viewProjects, openProject, saveProjects, viewDetails } from "../controller/project.controller.js";

import { Router } from "express";

const router = Router();

router.post("/view", viewProjects);
router.get("/open/:id", openProject);
router.post("/save", saveProjects);
router.get("/view/:id", viewDetails);

export default router;

