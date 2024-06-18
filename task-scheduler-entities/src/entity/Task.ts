import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TaskType } from "./TaskType";

@Entity()
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => TaskType, (taskType) => taskType.id)
    taskType!: TaskType;

    @Column()
    cron_expression!: string;

    @Column("jsonb")
    task_details!: object;

    @Column()
    scheduled_execution_time!: Date;

    @Column()
    is_recurring!: boolean;
}
