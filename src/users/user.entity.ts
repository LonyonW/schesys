import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;
    
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column( { default: true })
    is_active: boolean;

}