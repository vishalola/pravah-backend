import { createTask,assignTask,fetchTaskByUser, fetchTaskByID, completeTask } from "../controller/task.controller.js";

import { Router } from "express";

const router = Router();

router.post("/create", createTask);
router.post("/update",completeTask);
router.post("/assign",assignTask);
router.get("/fetchByUser", fetchTaskByUser);
router.post("/fetchByID", fetchTaskByID);

export default router;