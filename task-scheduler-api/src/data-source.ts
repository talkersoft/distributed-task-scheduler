import "reflect-metadata";
import { DataSource } from "typeorm";
import { TaskType } from "./entity/TaskType";
import { Task } from "./entity/Task";
import { Log } from "./entity/Log";
import { TaskExecution } from "./entity/TaskExecution";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "user",
    password: "password",
    database: "task_scheduler",
    synchronize: true,
    logging: false,
    entities: [TaskType, Task, Log, TaskExecution],
    migrations: [],
    subscribers: [],
});
