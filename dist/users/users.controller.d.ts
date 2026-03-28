import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Request as ExpressRequest } from 'express';
type AuthUser = {
    id: string;
    email: string;
    name: string;
};
type AuthenticatedRequest = ExpressRequest & {
    user: AuthUser;
};
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findMe(req: AuthenticatedRequest): Promise<UserEntity>;
    create(createUserDto: CreateUserDto): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findOne(id: string): Promise<UserEntity>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserEntity>;
    remove(id: string): Promise<UserEntity>;
}
export {};
