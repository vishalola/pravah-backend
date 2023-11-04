import { updateTask, fetchTaskByUser, fetchTaskByID } from "../controller/task.controller.js";

import { Router } from "express";

const router = Router();

router.post("/update", updateTask);
router.get("/fetchByUser", fetchTaskByUser);
router.get("/fetchByID", fetchTaskByID);

export default router;