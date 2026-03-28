import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '../users/entities/user.entity';
import { Response, Request as ExpressRequest } from 'express';
type AuthUser = {
    id: string;
    email: string;
    name: string;
};
type AuthenticatedRequest = ExpressRequest & {
    user: AuthUser;
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(createUserDto: CreateUserDto, res: Response): Promise<UserEntity>;
    login(loginDto: LoginDto, res: Response): Promise<{
        message: string;
    }>;
    logout(res: Response): {
        message: string;
    };
    getProfile(req: AuthenticatedRequest): Express.User & AuthUser;
}
export {};
