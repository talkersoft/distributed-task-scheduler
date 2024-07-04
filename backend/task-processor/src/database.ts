// Copyright Talkersoft LLC
// /backend/task-processor/src/database.ts
import { AppDataSource, TaskSchedule, ExecutionStatus } from 'task-entities';
import { Repository } from 'typeorm';

const RETRY_INTERVAL = 5000;
const MAX_RETRIES = 10;

async function initializeDatabaseConnection() {
  let retries = 0;
  let connectionError: any = null;
  
  while (retries < MAX_RETRIES) {
    try {
      await AppDataSource.initialize();
      console.log('Database connection established');
      return;
    } catch (err) {
      retries += 1;
      connectionError = err;
      console.log(`Retrying database connection in ${RETRY_INTERVAL / 1000} seconds... (${retries}/${MAX_RETRIES})`);
      await new Promise(res => setTimeout(res, RETRY_INTERVAL));
    }
  }

  if (retries === MAX_RETRIES) {
    console.error('Error during Data Source initialization after maximum retries:', connectionError);
  }
}

async function updateTaskStartTimeAndStatus(taskScheduleId: string) {
  const taskScheduleRepository: Repository<TaskSchedule> = AppDataSource.getRepository(TaskSchedule);

  const taskSchedule = await taskScheduleRepository.findOneBy({ id: taskScheduleId });
  if (taskSchedule) {
    taskSchedule.start_time = new Date();
    taskSchedule.status = ExecutionStatus.Processing;
    await taskScheduleRepository.save(taskSchedule);
  } else {
    console.error(`Task schedule with ID ${taskScheduleId} not found`);
  }
}

async function updateTaskEndTimeAndStatus(taskScheduleId: string) {
  const taskScheduleRepository: Repository<TaskSchedule> = AppDataSource.getRepository(TaskSchedule);

  const taskSchedule = await taskScheduleRepository.findOneBy({ id: taskScheduleId });
  if (taskSchedule) {
    taskSchedule.end_time = new Date();
    taskSchedule.status = ExecutionStatus.Completed;
    await taskScheduleRepository.save(taskSchedule);
  } else {
    console.error(`Task schedule with ID ${taskScheduleId} not found`);
  }
}

export { initializeDatabaseConnection, updateTaskStartTimeAndStatus, updateTaskEndTimeAndStatus };
