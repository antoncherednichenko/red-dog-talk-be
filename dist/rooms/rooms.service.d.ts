import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';
import { LivekitService } from './livekit.service';
type AuthUser = {
    id: string;
    email: string;
    name: string;
};
export declare class RoomsService {
    private readonly prisma;
    private readonly livekitService;
    constructor(prisma: PrismaService, livekitService: LivekitService);
    create(createRoomDto: CreateRoomDto, userId: string): Promise<{
        name: string;
        id: string;
        type: import(".prisma/client").$Enums.RoomType;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    findAll(userId: string): Promise<{
        name: string;
        id: string;
        type: import(".prisma/client").$Enums.RoomType;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }[]>;
    findOne(id: string): Promise<{
        name: string;
        id: string;
        type: import(".prisma/client").$Enums.RoomType;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    getMembers(roomId: string): Promise<({
        user: {
            email: string;
            name: string;
            password: string;
            id: string;
        };
    } & {
        id: string;
        status: import(".prisma/client").$Enums.RoomMemberStatus;
        lastSeen: Date;
        joinedAt: Date;
        userId: string;
        roomId: string;
    })[]>;
    update(id: string, updateRoomDto: UpdateRoomDto, userId: string): Promise<{
        name: string;
        id: string;
        type: import(".prisma/client").$Enums.RoomType;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        name: string;
        id: string;
        type: import(".prisma/client").$Enums.RoomType;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    join(roomId: string, userId: string): Promise<{
        name: string;
        id: string;
        type: import(".prisma/client").$Enums.RoomType;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    leave(roomId: string, userId: string): Promise<{
        name: string;
        id: string;
        type: import(".prisma/client").$Enums.RoomType;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    createCallAccessToken(roomId: string, user: AuthUser): Promise<{
        token: string;
        url: string;
        roomName: string;
        identity: string;
    }>;
}
export {};
