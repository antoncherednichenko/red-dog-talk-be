import { Room, RoomType, RoomMemberStatus } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity';
export declare class RoomMemberEntity {
    id: string;
    status: RoomMemberStatus;
    lastSeen: Date;
    joinedAt: Date;
    user: UserEntity;
    constructor(partial: Partial<RoomMemberEntity>);
}
export declare class RoomEntity implements Room {
    id: string;
    name: string;
    type: RoomType;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    constructor(partial: Partial<RoomEntity>);
}
