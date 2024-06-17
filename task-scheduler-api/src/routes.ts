import { Router } from "express";
import { getTaskTypes, createTask, getTasks } from "./controllers";

const router = Router();

router.get("/task-types", getTaskTypes);
router.post("/tasks", createTask);
router.get("/tasks", getTasks);

export default router;
