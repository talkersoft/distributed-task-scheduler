import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { TaskType } from "./TaskType";
import { TaskSchedule } from "./TaskSchedule";

@Entity()
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => TaskType, (taskType) => taskType.id)
    taskType!: TaskType;

    @Column()
    name!: string;

    @Column()
    cron_expression?: string;

    @Column("jsonb")
    task_details!: object;

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
