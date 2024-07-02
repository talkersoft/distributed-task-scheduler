// Copyright Talkersoft LLC
// /backend/task-entities/src/entity/TaskType.ts
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("task_types")
export class TaskType {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;
}
