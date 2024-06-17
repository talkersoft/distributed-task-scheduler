import { Router } from 'express';
import { getTaskTypes, createTask, getTasks, healthCheck } from './controllers';

const router = Router();

/**
 * @swagger
 * /task-types:
 *   get:
 *     summary: Retrieve a list of task types
 *     responses:
 *       200:
 *         description: A list of task types
 */
router.get("/task-types", getTaskTypes);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task_type_id:
 *                 type: string
 *               cron_expression:
 *                 type: string
 *               task_details:
 *                 type: object
 *               next_execution:
 *                 type: string
 *                 format: date-time
 *               is_recurring:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post("/tasks", createTask);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieve a list of tasks
 *     responses:
 *       200:
 *         description: A list of tasks
 */
router.get("/tasks", getTasks);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Check the health of the application
 *     responses:
 *       200:
 *         description: Application is healthy
 */
router.get("/health", healthCheck);

export default router;
