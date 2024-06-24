import { Request, Response } from 'express';
import { AppDataSource } from 'task-entities';
import { TaskType, Task, TaskSchedule, ExecutionStatus } from 'task-entities';

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
    const { task_type_id, cron_expression, task_details, scheduled_execution_time, is_recurring } = req.body;
    try {
        const taskRepository = AppDataSource.getRepository(Task);
        const taskTypeRepository = AppDataSource.getRepository(TaskType);
        const taskScheduleRepository = AppDataSource.getRepository(TaskSchedule);

        const taskType = await taskTypeRepository.findOneBy({ id: task_type_id });
        if (!taskType) {
            return res.status(400).json({ message: 'Invalid task type ID' });
        }

        const task = new Task();
        task.taskType = taskType;
        task.task_details = task_details;
        task.is_recurring = is_recurring;
        task.task_created = new Date();

        if (is_recurring) {
            task.cron_expression = cron_expression;
        } else {
            task.scheduled_execution_time = new Date(scheduled_execution_time);
        }

        await taskRepository.save(task);

        if (!is_recurring) {
            const taskSchedule = new TaskSchedule();
            taskSchedule.task = task;
            taskSchedule.scheduled_time = task.scheduled_execution_time!;
            taskSchedule.status = ExecutionStatus.Scheduled;

            await taskScheduleRepository.save(taskSchedule);
        }

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

export const deleteTask = async (req: Request, res: Response) => {
    const { taskId } = req.params;
    try {
        const taskRepository = AppDataSource.getRepository(Task);
        const taskScheduleRepository = AppDataSource.getRepository(TaskSchedule);

        const task = await taskRepository.findOneBy({ id: taskId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await taskScheduleRepository.delete({ task: task });
        await taskRepository.delete({ id: taskId });

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting task:', error);
        const errorMessage = isErrorWithMessage(error) ? error.message : 'Internal Server Error';
        res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
    }
};

export const editTask = async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { task_type_id, cron_expression, task_details, scheduled_execution_time, is_recurring } = req.body;
    try {
        const taskRepository = AppDataSource.getRepository(Task);
        const taskTypeRepository = AppDataSource.getRepository(TaskType);
        const taskScheduleRepository = AppDataSource.getRepository(TaskSchedule);

        const task = await taskRepository.findOneBy({ id: taskId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const taskType = await taskTypeRepository.findOneBy({ id: task_type_id });
        if (!taskType) {
            return res.status(400).json({ message: 'Invalid task type ID' });
        }

        await taskScheduleRepository.delete({ task: task });

        task.taskType = taskType;
        task.task_details = task_details;
        task.is_recurring = is_recurring;

        if (is_recurring) {
            task.cron_expression = cron_expression;
            task.scheduled_execution_time = undefined;
        } else {
            task.scheduled_execution_time = new Date(scheduled_execution_time);
            task.cron_expression = undefined;
        }

        await taskRepository.save(task);

        if (!is_recurring) {
            const taskSchedule = new TaskSchedule();
            taskSchedule.task = task;
            taskSchedule.scheduled_time = task.scheduled_execution_time!;
            taskSchedule.status = ExecutionStatus.Scheduled;

            await taskScheduleRepository.save(taskSchedule);
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Error editing task:', error);
        const errorMessage = isErrorWithMessage(error) ? error.message : 'Internal Server Error';
        res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
    }
};

export const healthCheck = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Healthy' });
};

export const getScheduledTasksSummary = async (req: Request, res: Response) => {
    try {
        const query = `SELECT * FROM scheduled_tasks_summary`;
        const result = await AppDataSource.query(query);
        res.json(result);
    } catch (error) {
        console.error('Error fetching scheduled tasks summary:', error);
        const errorMessage = isErrorWithMessage(error) ? error.message : 'Internal Server Error';
        res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
    }
};
