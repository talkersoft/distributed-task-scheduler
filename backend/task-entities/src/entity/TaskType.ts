import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class TaskType {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;
}
