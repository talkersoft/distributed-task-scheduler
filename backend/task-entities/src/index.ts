// Copyright Talkersoft LLC
// /backend/task-entities/src/index.ts
export * from "./entity/Task";
export { TaskDetails } from "./entity/Task";
export * from "./entity/TaskSchedule";
export { ExecutionStatus } from "./entity/TaskSchedule";
export * from "./entity/TaskType";
export { AppDataSource } from "./data-source";

// Side effect of referencing task-entities 
// this will override your console log to prepend timstamp
export * from "./utility/formatDateTime";
export * from "./utility/setupConsoleLogOverride";
