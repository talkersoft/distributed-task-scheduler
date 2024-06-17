import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { TaskType } from "./TaskType";

@Entity()
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => TaskType, (taskType) => taskType.id)
    task_type_id!: TaskType;

    @Column()
    cron_expression!: string;

    @Column("jsonb")
    task_details!: object;

    @Column()
    next_execution!: Date;

    @Column()
    is_recurring!: boolean;
}
