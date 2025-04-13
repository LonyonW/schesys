import { hash } from "bcrypt";
import { Rol } from "src/roles/rol.entity";
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, ManyToMany, JoinTable } from "typeorm";

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

    @JoinTable({
        name: 'users_has_roles', // table name for the join table
        joinColumn: {
            name: 'user_id', // name of the column that references the user
        },
        inverseJoinColumn: {
            name: 'rol_id', // name of the column that references the rol
        },
    }) // principal table
    @ManyToMany(() => Rol, (rol) => rol.users)
    roles: Rol[];

}