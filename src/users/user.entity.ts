import { hash } from "bcrypt";
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert } from "typeorm";

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


    @BeforeInsert()
    async hashPassword() {
        this.password = await hash(this.password, Number(process.env.HASH_SALT));
    }

}