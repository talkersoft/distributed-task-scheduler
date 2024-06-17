import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Task } from "./Task";

@Entity()
export class Log {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @ManyToOne(() => Task, (task) => task.id)
    task_id!: Task;

    @Column()
    message!: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    log_time!: Date;
}
