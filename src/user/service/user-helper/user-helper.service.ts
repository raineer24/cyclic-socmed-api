import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../models/dto/create-user.dto';
import { LoginUserDto } from '../../models/dto/login-user.dto';
import { User } from '../../models/user.interface';

@Injectable()
export class UserHelperService {
  createUserDtoEntity(createUserDto: CreateUserDto): User {
    return {
      name: createUserDto.name,
      email: createUserDto.email,
      username: createUserDto.username,
      password: createUserDto.password,
      role: createUserDto.role,
    };
  }

  loginUserDtoToEntity(loginUserDto: LoginUserDto) {
    return {
      email: loginUserDto.email,
      password: loginUserDto.password,
    };
  }
}
