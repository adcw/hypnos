import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

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

  @Delete()
  async removeUser(@Param('userId') userId: string): Promise<User> {
      return this.usersService.removeUser(userId);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
      return this.usersService.createUser(createUserDto.email, createUserDto.password)
  }

  @Patch(':userId')
  async updateUser(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDto): Promise<User> {
      return this.usersService.updateUser(userId, updateUserDto);
  }
}