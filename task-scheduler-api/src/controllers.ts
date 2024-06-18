import { Request, Response } from 'express';
import { AppDataSource } from 'task-scheduler-entities';
import { TaskType, Task } from 'task-scheduler-entities';

const isErrorWithMessage = (error: unknown): error is { message: string } => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message: string }).message === 'string'
    );
};

export const getTaskTypes = async (req: Request, res: Response) => {
    try {
        const taskTypeRepository = AppDataSource.getRepository(TaskType);
        const taskTypes = await taskTypeRepository.find();
        res.json(taskTypes);
    } catch (error) {
        console.error('Error fetching task types:', error);
        const errorMessage = isErrorWithMessage(error) ? error.message : 'Internal Server Error';
        res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
    }
};

export const createTask = async (req: Request, res: Response) => {
    const { task_type_id, cron_expression, task_details, next_execution, is_recurring } = req.body;
    try {
        const taskRepository = AppDataSource.getRepository(Task);
        const taskTypeRepository = AppDataSource.getRepository(TaskType);

        const taskType = await taskTypeRepository.findOneBy({ id: task_type_id });
        if (!taskType) {
            return res.status(400).json({ message: 'Invalid task type ID' });
        }

        const task = new Task();
        task.taskType = taskType;
        task.cron_expression = cron_expression;
        task.task_details = task_details;
        task.scheduled_execution_time = new Date(next_execution);
        task.is_recurring = is_recurring;

        await taskRepository.save(task);
        res.status(201).json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        const errorMessage = isErrorWithMessage(error) ? error.message : 'Internal Server Error';
        res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
    }
};

export const getTasks = async (req: Request, res: Response) => {
    try {
        const taskRepository = AppDataSource.getRepository(Task);
        const tasks = await taskRepository.find();
        res.json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        const errorMessage = isErrorWithMessage(error) ? error.message : 'Internal Server Error';
        res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
    }
};

export const healthCheck = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Healthy' });
};
