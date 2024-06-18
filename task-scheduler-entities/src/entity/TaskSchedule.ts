import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Task } from "./Task";

export enum ExecutionStatus {
    Started = "Started",
    Completed = "Completed",
    Failed = "Failed",
    Scheduled = "Scheduled"
}

@Entity()
export class TaskSchedule {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Task, (task) => task.id)
    task!: Task;

    @Column()
    start_time!: Date;

    @Column({ nullable: true })
    end_time?: Date;

    @Column({ nullable: true })
    scheduled_execution_time?: Date;

    @Column({
        type: "enum",
        enum: ExecutionStatus,
        default: ExecutionStatus.Started,
    })
    status!: ExecutionStatus;
}
