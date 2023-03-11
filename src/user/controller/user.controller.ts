import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Put,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Request,
  Res,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User, UserRole } from '../models/user.interface';
import { Observable, of } from 'rxjs';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { catchError, map, tap } from 'rxjs/operators';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { CreateUserDto } from '../models/dto/create-user.dto';
import { LoginUserDto } from '../models/dto/login-user.dto';
import { LoginResponseI } from '../models/login-response.interface';
import { Pagination } from 'nestjs-typeorm-paginate';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { Express } from 'express';
import { UserIsUserGuard } from 'src/auth/guards/UserIsUser.guard';

import 'multer';

// export const storage = {
//   storage: diskStorage({
//     destination: './uploads/profileimages',
//     filename: (req, file, cb) => {
//       const filename: string =
//         path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
//       const extension: string = path.parse(file.originalname).ext;

//       cb(null, `${filename}${extension}`);
//     },
//   }),
//   // eslint-disable-next-line prettier/prettier
// };
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const userEntity: User =
      this.userHelperService.createUserDtoEntity(createUserDto);
    console.log('userentity', userEntity);
    return this.userService.create(userEntity);
  }
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseI> {
    const userEntity: User =
      this.userHelperService.loginUserDtoToEntity(loginUserDto);
    const jwt: string = await this.userService.login(userEntity);
    return {
      access_token: jwt,
      token_type: 'JWT',
      expires_in: 10000,
    };
  }

  @Get(':id')
  findOne(@Param() params): Observable<User> {
    return this.userService.find0ne(params.id);
  }

  @Get()
  index(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('username') username: string,
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;
    console.log('username,', username);

    if (username === null || username === undefined) {
      return this.userService.paginate({
        page: Number(page),
        limit: Number(limit),
        route: 'http://localhost:3000/api/user',
      });
    } else {
      return this.userService.paginateFilterByUsername(
        {
          page: Number(page),
          limit: Number(limit),
          route: 'http://localhost:3000/api/user ',
        },
        { username },
      );
    }
  }

  @Delete('id')
  deleteOne(@Param('id') id: string): Observable<any> {
    return this.userService.deleteOne(Number(id));
  }

  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  @Put(':id')
  updateOne(@Param('id') id: string, @Body() user: User): Observable<any> {
    return this.userService.updateOne(Number(id), user);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(
    @Param('id') id: string,
    @Body() user: User,
  ): Observable<User> {
    return this.userService.updateRoleOfUser(Number(id), user);
  }

  // @UseGuards(JwtAuthGuard)
  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file', storage))
  // // eslint-disable-next-line @typescript-eslint/ban-types
  // uploadFile(@UploadedFile() file, @Request() req): Observable<Object> {
  //   const user: User = req.user;

  //   return this.userService
  //     .updateOne(user.id, { profileImage: file.filename })
  //     .pipe(
  //       tap((user: User) => console.log(user)),
  //       map((user: User) => ({ profileImage: user.profileImage })),
  //     );
  // }

  // @Get('profile-image/:imagename')
  // findProfileImage(
  //   @Param('imagename') imagename,
  //   @Res() res,
  // // eslint-disable-next-line @typescript-eslint/ban-types
  // ): Observable<Object> {
  //   return of(
  //     res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename)),
  //   );
  // }
}
