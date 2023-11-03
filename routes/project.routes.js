import { viewProjects, openProject, saveProjects } from "../controller/project.controller.js";

import { Router } from "express";

const router = Router();

router.post("/view", viewProjects);
// router.post("/fetch", openProject);
router.post("/save", saveProjects);

export default router;

