import "reflect-metadata";
import { DataSource } from "typeorm";
import { TaskType } from "./entity/TaskType";
import { Task } from "./entity/Task";
import { TaskSchedule } from "./entity/TaskSchedule";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    logging: false,
    entities: [TaskType, Task, TaskSchedule],
    migrations: [],
    subscribers: [],
});
