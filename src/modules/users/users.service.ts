import { UserDto } from './user.dto';
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Service } from '../common/service.interface';
import { InjectRepository } from '@nestjs/typeorm';

function userDto(user: User): UserDto {
  const roles = user.roles.map(role => role.name);
  delete user.roles;
  const taskIds = user.tasks.map(task => task.id);
  delete user.tasks;
  return { ...user, roles, taskIds } as UserDto;
}

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) { }

  private async seed() {
    const usersRepository = await this.repository;
    const count = await usersRepository.count();
    if (count === 0) {
//            const users = await usersRepository.save([new User('John Doe', 30), new User('Jane Doe', 40)]);
            // console.log('Seeded Users.');
//            console.log(users);
    }
  }

  public async add(user: any): Promise<UserDto> {
    return (await this.repository).save(user);
  }

  public async addAll(users: UserDto[]): Promise<any[]> {
    return (await this.repository).save(users);
  }

  public async getAll(): Promise<any> {
    return (await this.repository)
    .find({ relations: ['tasks', 'roles'] })
    .then(users => ({ users: users.map(user => userDto(user)) }));
  }

  public async get(email: string): Promise<any> {
    return (await this.repository)
    .findOne({ where: { email }, relations: ['tasks', 'roles'] })
    .then(user => userDto(user));
  }

  public async update(user: User): Promise<UserDto> {
    return (await this.repository)
    .save(user)
    .then(savedUser => userDto(savedUser));
  }

  public async remove(user: User): Promise<UserDto> {
    return (await this.repository)
    .remove(user)
    .then(removedUser => userDto(removedUser));
  }
}
