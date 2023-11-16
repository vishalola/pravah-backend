import { viewProjects, openProject, saveProjects, viewDetails, editNode } from "../controller/project.controller.js";

import { Router } from "express";

const router = Router();

router.get("/view", viewProjects);
router.get("/open/:id", openProject);
router.post("/save", saveProjects);
router.get("/view/:id", viewDetails);
router.post("/edit/:id", editNode);

export default router;

