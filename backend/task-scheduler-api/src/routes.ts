// Copyright Talkersoft LLC
// /backend/task-scheduler-api/src/routes.ts
import { Router } from 'express';
import { getTaskTypes, createTask, getTasks, healthCheck, setInactive, editTask, getScheduledTasksSummary, getTaskSummary } from './controllers';

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
 *               scheduled_execution_time:
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
 *  Here's the complete updated `routes.ts` file with Swagger documentation and the updated controller functions:

```typescript
import { Router } from 'express';
import { getTaskTypes, createTask, getTasks, healthCheck, setInactive, editTask, getScheduledTasksSummary } from './controllers';

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
 *               scheduled_execution_time:
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
 * /tasks/{taskId}:
 *   put:
 *     summary: Edit a task
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
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
 *               scheduled_execution_time:
 *                 type: string
 *                 format: date-time
 *               is_recurring:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Task edited successfully
 *       400:
 *         description: Invalid task type ID
 *       404:
 *         description: Task not found
 */
router.put("/tasks/:taskId", editTask);

/**
 * @swagger
 * /tasks/{taskId}/inactive:
 *   put:
 *     summary: Set a task to inactive
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Task set to inactive successfully
 *       404:
 *         description: Task not found
 */
router.put("/tasks/:taskId/inactive", setInactive);

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

/**
 * @swagger
 * /scheduled-tasks-summary:
 *   get:
 *     summary: Retrieve a summary of scheduled tasks
 *     responses:
 *       200:
 *         description: A summary of scheduled tasks
 */
router.get("/scheduled-tasks-summary", getScheduledTasksSummary);

/**
 * @swagger
 * /task-summary:
 *   get:
 *     summary: Retrieve the average elapsed time per task type
 *     responses:
 *       200:
 *         description: Average elapsed time per task type
 */
router.get("/task-summary", getTaskSummary);

export default router;