//import { User } from "src/users/user.entity";
import { User } from '../users/user.entity';
import { Column, Entity, ManyToMany, PrimaryColumn } from "typeorm";

@Entity({name: 'roles'}) //table name in database
export class Rol {
    
    @PrimaryColumn()
    id: string;

    @Column()
    name: string;

    @Column()
    route: string;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];



}