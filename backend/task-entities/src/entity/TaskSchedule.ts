// Copyright Talkersoft LLC
// /backend/task-entities/src/entity/TaskSchedule.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Task } from "./Task";

export enum ExecutionStatus {
    Scheduled = "Scheduled",
    Queued = "Queued",
    Processing = "Processing",
    Completed = "Completed",
    Failed = "Failed",
}

@Entity("task_schedule")
export class TaskSchedule {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Task, (task) => task.id)
    @JoinColumn({ name: "task_id" })
    task!: Task;

    @Column()
    scheduled_time!: Date;

    @Column({ nullable: true })
    start_time?: Date;

    @Column({ nullable: true })
    end_time?: Date;

    @Column({
        type: "enum",
        enum: ExecutionStatus,
        default: ExecutionStatus.Scheduled,
    })
    status!: ExecutionStatus;
}
