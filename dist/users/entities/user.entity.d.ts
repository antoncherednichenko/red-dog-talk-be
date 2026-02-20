import { User } from '@prisma/client';
export declare class UserEntity implements User {
    constructor(partial: Partial<UserEntity>);
    id: string;
    email: string;
    name: string;
    password: string;
}
