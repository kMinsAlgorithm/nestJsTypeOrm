import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.models';
import { UserEntitiy } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntitiy)
    private usersRepository: Repository<UserEntitiy>,
  ) {}

  private users: User[] = [];

  //회원가입 기능
  async create(createUserDto: CreateUserDto) {
    const { userId, userPw, userName } = createUserDto;

    const email = 'hi';
    const managerExist = await this.usersRepository.findOne({
      where: { email },
    });

    if (managerExist) {
      throw new ConflictException('User Already Exist');
    }
    const user = {
      email,
      name: userName,
    };
    this.usersRepository.save(user);
  }

  //전체 회원 정보 검색
  findAll() {
    return this.users;
  }

  //특정 회원 정보
  findOne(userId: string) {
    const user = this.users.find((user) => user.userId === userId);
    if (!user) {
      throw new NotFoundException('User Not Exist');
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const { userId, userName } = updateUserDto;
    const user = this.users.find((user) => user.userId === id);
    if (!user) {
      throw new BadRequestException('User Not Exist');
    }
    // 해당 유저 정보 제거 후
    this.users = this.users.filter((user) => user.userId !== id);
    console.log(this.users);
    user.userId = userId;
    user.userName = userName;
    this.users.push(user);
    console.log('게시글 수정 완료');
  }
}
