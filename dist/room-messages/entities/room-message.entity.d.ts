import { RoomMessage } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity';
export declare class RoomMessageEntity implements RoomMessage {
    constructor(partial: Partial<RoomMessageEntity>);
    id: string;
    roomId: string;
    authorId: string;
    text: string;
    createdAt: Date;
    author: UserEntity;
}
