import {
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';
import { Task } from '../tasks/task.entity';
import { Role } from '../roles/role.entity';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;

  @ManyToMany(type => Role, (role: Role) => role.users, {
//    cascadeInsert: true,
//    cascadeUpdate: true,
  })
  @JoinTable()
  roles: Role[];

  @OneToMany(type => Task, (task: Task) => task.user, {
//    cascadeInsert: true,
//    cascadeUpdate: true,
  })
  tasks: Task[];
}
