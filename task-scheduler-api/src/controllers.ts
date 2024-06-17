import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { TaskType } from "./entity/TaskType";
import { Task } from "./entity/Task";

export const getTaskTypes = async (req: Request, res: Response) => {
    const taskTypeRepository = AppDataSource.getRepository(TaskType);
    const taskTypes = await taskTypeRepository.find();
    res.json(taskTypes);
};

export const createTask = async (req: Request, res: Response) => {
    const { task_type_id, cron_expression, task_details, next_execution, is_recurring } = req.body;
    const taskRepository = AppDataSource.getRepository(Task);

    const task = new Task();
    task.task_type_id = task_type_id;
    task.cron_expression = cron_expression;
    task.task_details = task_details;
    task.next_execution = new Date(next_execution);
    task.is_recurring = is_recurring;

    await taskRepository.save(task);
    res.status(201).json(task);
};

export const getTasks = async (req: Request, res: Response) => {
    const taskRepository = AppDataSource.getRepository(Task);
    const tasks = await taskRepository.find();
    res.json(tasks);
};
