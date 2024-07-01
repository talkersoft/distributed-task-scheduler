import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { TaskType } from "./TaskType";
import { TaskSchedule } from "./TaskSchedule";

export interface TaskDetails {
    message?: string;
    [key: string]: any;
}

@Entity('tasks') // Specify the correct table name
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => TaskType, (taskType) => taskType.id)
    @JoinColumn({ name: "task_type_id" })
    taskType!: TaskType;

    @Column()
    name!: string;

    @Column()
    cron_expression?: string;

    @Column("jsonb")
    task_details!: TaskDetails;

    @Column()
    scheduled_execution_time?: Date;

    @Column()
    is_recurring!: boolean;

    @Column()
    time_zone!: string;

    @Column()
    task_created!: Date;

    @OneToMany(() => TaskSchedule, (taskSchedule) => taskSchedule.task)
    taskSchedules!: TaskSchedule[];
}
