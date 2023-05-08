import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  UserCreateRequestDto,
  UserProfileUpdateRequestDto,
  UserResponseDto,
  UserUpdateRequestDto,
} from './user.dto';
import { User } from './user.entity';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { hash } from 'bcrypt';
import { omit } from 'lodash';
import { UserRepository } from '@/api/user/user.repository';
import { MinioFileService } from '@/service/file-serivce/minio-file-service';
import { UserRole } from '@/api/user/user-role.enum';
import { NoDataFoundError } from '@/error/no-data-found.error';

@Injectable()
export class UserService {
  @Inject(UserRepository)
  private readonly repository: UserRepository;
  @Inject(MinioFileService)
  private readonly fileService: MinioFileService;
  @InjectMapper()
  private readonly classMapper: Mapper;

  public async findByEmail(email: string) {
    return this.classMapper.mapAsync(
      await this.repository.findOne({ where: { email } }),
      User,
      UserResponseDto,
    );
  }

  public async findUserByEmail(email: string) {
    return this.repository.findOne({ where: { email } });
  }

  public async create(payload: UserCreateRequestDto) {
    Logger.log('UserService#create', { ...omit(payload, 'avatar') });
    let avatarUrl: string;

    if (payload.avatar) {
      avatarUrl = await this.fileService.upload(payload.avatar);

      Logger.log('UserService#create upload avatar' + avatarUrl);
    }

    return this.classMapper.mapAsync(
      await this.repository.save({
        ...(omit(payload, 'avatar') as User),
        password: await hash(payload.password, 12),
        avatarUrl,
      }),
      User,
      UserResponseDto,
    );
  }

  public async update(
    id: number,
    payload: UserUpdateRequestDto | UserProfileUpdateRequestDto,
  ) {
    Logger.log('UserService#update', omit(payload, 'avatar'));

    if (!(await this.isPresentById(id))) {
      throw new NoDataFoundError(User, id);
    }

    let avatarUrl: string;

    if (payload.avatar) {
      avatarUrl = await this.fileService.upload(payload.avatar);

      Logger.debug('file url ' + avatarUrl);
    }

    return this.classMapper.mapAsync(
      await this.repository.updateById({
        ...omit({ ...payload, id }, 'avatar'),
        ...(avatarUrl && { avatarUrl }),
        ...(payload.password && { password: await hash(payload.password, 12) }),
      }),
      User,
      UserResponseDto,
    );
  }

  public async getAllClients() {
    return this.classMapper.mapArrayAsync(
      await this.repository.find({
        where: { role: UserRole.CLIENT },
        relations: { plants: true },
      }),
      User,
      UserResponseDto,
    );
  }

  public async getAll() {
    return this.classMapper.mapArrayAsync(
      await this.repository.find({ relations: { plants: true } }),
      User,
      UserResponseDto,
    );
  }

  public async deleteById(id: number) {
    Logger.log('UserService#deleteById', { id });

    return this.repository.delete(id).then((result) => result.affected);
  }

  public async isPresentById(id: number) {
    return (await this.repository.count({ where: { id } })) === 1;
  }

  public async findById(id: number) {
    return this.repository.findOne({ where: { id } });
  }
}
