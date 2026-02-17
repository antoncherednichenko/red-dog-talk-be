import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
export declare const roundsOfHashing = 10;
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createUserDto: CreateUserDto): Promise<{
        email: string;
        name: string;
        password: string;
        id: string;
    }>;
    findAll(): Promise<{
        email: string;
        name: string;
        password: string;
        id: string;
    }[]>;
    findOne(id: string): Promise<{
        email: string;
        name: string;
        password: string;
        id: string;
    } | null>;
    findByEmail(email: string): Promise<{
        email: string;
        name: string;
        password: string;
        id: string;
    } | null>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        email: string;
        name: string;
        password: string;
        id: string;
    }>;
    remove(id: string): Promise<{
        email: string;
        name: string;
        password: string;
        id: string;
    }>;
}
