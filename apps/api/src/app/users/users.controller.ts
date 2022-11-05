import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@ApiTags('User')
//localhost/api/users
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

//localhost/api/users/1
  @Get(':userId')
  async getUser(@Param('userId') userId: string): Promise<User> {
    return this.usersService.getUserById(userId);
  }

//localhost/api/users
  @Get()
  async getUsers(): Promise<User[]> {
      return this.usersService.getUsers();
  }

  @Delete(':userId')
  async removeUser(@Param('userId') userId: string): Promise<User> {
      return this.usersService.removeUser(userId);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'User has been created'
  })
  @ApiBadRequestResponse({
    description: 'Cannot create user'
  })
  async createUser(@Body(ValidationPipe) createUserDto: CreateUserDto): Promise<User> {
      return this.usersService.createUser(createUserDto.email, createUserDto.password)
  }

  @ApiCreatedResponse({
    description: 'Password has been changed'
  })
  @ApiBadRequestResponse({
    description: 'Cannot change password'
  })
  @Patch(':userId')
  async updateUser(@Param('userId') userId: string, @Body(ValidationPipe) updateUserDto: UpdateUserDto): Promise<User> {
      return this.usersService.updateUser(userId, updateUserDto);
  }
}