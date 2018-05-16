import { CommandDto } from './command.dto';
import { Component } from '@nestjs/common';
import { TypeOrmDatabaseService } from '../database/typeOrm.database.service';
import { Command } from './command.entity';
import { Repository } from 'typeorm';
import { Service } from '../common/service.interface';

function commandDto(command: Command): CommandDto {
  const userId = command.user && command.user.id;
  const mediaIds = command.medias && command.medias.map(media => media.id);
  delete command.user;
  delete command.medias;
  return { ...command, mediaIds, userId } as CommandDto;
}

@Component()
export class CommandsService {

  constructor(private databaseService: TypeOrmDatabaseService) { }

  private get repository(): Promise<Repository<Command>> {
    return this.databaseService.getRepository(Command);
  }

  private async seed() {
    const commandsRepository = await this.repository;
    const count = await commandsRepository.count();
    if (count === 0) {
//            const commands = await commandsRepository.save([new Command('John Doe', 30), new Command('Jane Doe', 40)]);
            console.log('Seeded Commands.');
//            console.log(commands);
    }
  }

  public async add(command: CommandDto): Promise<CommandDto> {
    console.log('qsqsdqsqsdsqd', command);
    return (await this.repository).save(command);
  }

  public async addAll(commands: CommandDto[]): Promise<any[]> {
    return (await this.repository).save(commands);
  }

  public async getAll(): Promise<any> {
    const repository = await this.repository;
    const commands = await repository.find({ relations: ['user', 'medias'] })
    return { commands: commands.map(command => commandDto(command)) };
  }

  public async get(id: number): Promise<any> {
    return (await this.repository)
    .findOneById(id, { relations: ['user', 'medias'] })
    .then(command => commandDto(command));
  }

  public async update(commandId: number, changes: any): Promise<CommandDto> {
    const repository = (await this.repository);
    let command = await repository.findOneById(commandId);
    command = { ...command, ...changes }
    return repository
    .save(command)
    .then(savedCommand => commandDto(savedCommand));
  }

  public async remove(commandId: number): Promise<CommandDto> {
    const repository = (await this.repository);
    const command = await repository.findOneById(commandId, { relations: ['user', 'medias'] });
    await repository.remove(command);
    command.id = commandId
    return commandDto(command);
  }
}