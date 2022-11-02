import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { UpdateUserDto } from "./dto/update-user.dto";

import { User } from "./schemas/user.schema";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async getUserById(userId: string): Promise<User> {
        return this.usersRepository.findOne({ userId })
    }

    async getUsers(): Promise<User[]> {
        return this.usersRepository.find({});
    }

    async removeUser(userId: string): Promise<User> {
        const user = await this.usersRepository.findOne({ userId });
        return this.usersRepository.remove(user);
    }

    async createUser(email: string, password: string): Promise<User> {
        return this.usersRepository.create({
            userId: uuidv4(),
            email,
            password,
        })
    }

    async updateUser(userId: string, userUpdates: UpdateUserDto): Promise<User> {
        return this.usersRepository.findOneAndUpdate({ userId }, userUpdates);
    }
}