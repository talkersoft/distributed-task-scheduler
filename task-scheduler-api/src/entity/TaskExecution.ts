import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Task } from "./Task";

export enum ExecutionStatus {
    Started = "Started",
    Completed = "Completed",
    Failed = "Failed",
}

@Entity()
export class TaskExecution {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Task, (task) => task.id)
    task_id!: Task;

    @Column()
    start_time!: Date;

    @Column()
    end_time!: Date;

    @Column({
        type: "enum",
        enum: ExecutionStatus,
    })
    status!: ExecutionStatus;
}
