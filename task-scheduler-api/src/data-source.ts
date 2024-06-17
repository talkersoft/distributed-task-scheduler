import "reflect-metadata";
import { DataSource } from "typeorm";
import { TaskType } from "./entity/TaskType";
import { Task } from "./entity/Task";
import { Log } from "./entity/Log";
import { TaskExecution } from "./entity/TaskExecution";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    logging: false,
    entities: [TaskType, Task, Log, TaskExecution],
    migrations: [],
    subscribers: [],
});
