import { Request, Response } from 'express';
import { AppDataSource } from 'task-entities';
import { TaskType, Task, TaskSchedule, ExecutionStatus, TaskDetails } from 'task-entities';
import { IsNull } from 'typeorm';
import moment from 'moment-timezone';

const isErrorWithMessage = (error: unknown): error is { message: string } => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message: string }).message === 'string'
    );
};

interface TaskResponse {
    id: string;
    name: string;
    task_type: string;
    task_type_id: string;
    cron_expression: string | undefined;
    message: string | undefined;
    next_runtime: string;
    time_zone: string;
    is_recurring: boolean;
    scheduled_execution_time: Date | undefined;
}

const formatTaskResponse = (task: Task): TaskResponse => {
    const nextRuntime = task.scheduled_execution_time 
        ? moment.tz(task.scheduled_execution_time, task.time_zone).format('MM-DD-yyyy hh:mm A')
        : 'N/A';

    const taskDetails = task.task_details as TaskDetails;

    return {
        id: task.id,
        name: task.name,
        task_type: task.taskType.name,
        task_type_id: task.taskType.id,
        cron_expression: task.cron_expression,
        message: taskDetails.message,
        next_runtime: nextRuntime,
        time_zone: task.time_zone,
        is_recurring: task.is_recurring,
        scheduled_execution_time: task.scheduled_execution_time,
    };
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
    const { task_type_id, name, cron_expression, task_details, scheduled_execution_time, is_recurring, message, time_zone } = req.body;
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
        task.name = name;
        task.task_details = { ...task_details, message };
        task.is_recurring = is_recurring;
        task.task_created = moment.utc().toDate();
        task.time_zone = time_zone;

        if (is_recurring) {
            task.cron_expression = cron_expression;
        } else {
            task.scheduled_execution_time = moment.utc(scheduled_execution_time || moment.utc()).toDate();
        }

        await taskRepository.save(task);

        if (!is_recurring) {
            const taskSchedule = new TaskSchedule();
            taskSchedule.task = task;
            taskSchedule.scheduled_time = task.scheduled_execution_time!;
            taskSchedule.status = ExecutionStatus.Scheduled;

            await taskScheduleRepository.save(taskSchedule);
        }

        res.status(201).json(formatTaskResponse(task));
    } catch (error) {
        console.error('Error creating task:', error);
        const errorMessage = isErrorWithMessage(error) ? error.message : 'Internal Server Error';
        res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
    }
};

export const getTasks = async (req: Request, res: Response) => {
    try {
        const taskRepository = AppDataSource.getRepository(Task);
        const tasks = await taskRepository.find({ relations: ["taskType", "taskSchedules"] });

        const mappedTasks = tasks.map(formatTaskResponse);

        res.json(mappedTasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        const errorMessage = isErrorWithMessage(error) ? error.message : 'Internal Server Error';
        res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
    }
};

export const setInactive = async (req: Request, res: Response) => {
    const { taskId } = req.params;
    try {
        const taskRepository = AppDataSource.getRepository(Task);
        const taskScheduleRepository = AppDataSource.getRepository(TaskSchedule);

        const task = await taskRepository.findOneBy({ id: taskId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.active = false;
        await taskRepository.save(task);

        await taskScheduleRepository.delete({ task: task, start_time: IsNull() });

        res.status(204).send();
    } catch (error) {
        console.error('Error setting task inactive:', error);
        const errorMessage = isErrorWithMessage(error) ? error.message : 'Internal Server Error';
        res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
    }
};

export const editTask = async (req: Request, res: Response) => {
    const { taskId } = req.params;
    const { task_type_id, name, cron_expression, task_details, scheduled_execution_time, is_recurring, message, time_zone } = req.body;
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

        await taskScheduleRepository.delete({ task: task, start_time: IsNull() });

        task.taskType = taskType;
        task.name = name;
        task.task_details = { ...task_details, message };
        task.is_recurring = is_recurring;
        task.time_zone = time_zone;

        if (is_recurring) {
            task.cron_expression = cron_expression;
            task.scheduled_execution_time = undefined;
        } else {
            task.scheduled_execution_time = moment.utc(scheduled_execution_time || moment.utc()).toDate();
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

        res.status(200).json(formatTaskResponse(task));
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
        const query = `
            SELECT sts.*, c.value as number_of_instances
            FROM scheduled_tasks_summary sts
            JOIN configuration c ON c.key = 'number_of_instances';
        `;
        const result = await AppDataSource.query(query);
        res.json(result);
    } catch (error) {
        console.error('Error fetching scheduled tasks summary:', error);
        const errorMessage = isErrorWithMessage(error) ? error.message : 'Internal Server Error';
        res.status(500).json({ message: 'Internal Server Error', error: errorMessage });
    }
};
