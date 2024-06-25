import { AppDataSource, TaskSchedule, ExecutionStatus } from 'task-entities';
import { Repository } from 'typeorm';

async function initializeDatabaseConnection() {
  let retries = 10;
  while (retries) {
    try {
      await AppDataSource.initialize();
      console.log('Database connection established');
      break;
    } catch (err) {
      console.log(`Retrying database connection... ${retries} attempts left`);
      retries -= 1;
      await new Promise(res => setTimeout(res, 2000));
    }
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
