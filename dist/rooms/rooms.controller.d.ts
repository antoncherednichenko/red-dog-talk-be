import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomEntity, RoomMemberEntity } from './entities/room.entity';
import { Request as ExpressRequest } from 'express';
type AuthUser = {
    id: string;
    email: string;
    name: string;
};
type AuthenticatedRequest = ExpressRequest & {
    user: AuthUser;
};
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    create(createRoomDto: CreateRoomDto, req: AuthenticatedRequest): Promise<RoomEntity>;
    findAll(req: AuthenticatedRequest): Promise<RoomEntity[]>;
    findOne(id: string): Promise<RoomEntity>;
    getMembers(id: string): Promise<RoomMemberEntity[]>;
    update(id: string, updateRoomDto: UpdateRoomDto, req: AuthenticatedRequest): Promise<RoomEntity>;
    remove(id: string, req: AuthenticatedRequest): Promise<{
        name: string;
        id: string;
        type: import(".prisma/client").$Enums.RoomType;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    join(id: string, req: AuthenticatedRequest): Promise<{
        id: string;
    }>;
    leave(id: string, req: AuthenticatedRequest): Promise<RoomEntity>;
    createCallToken(id: string, req: AuthenticatedRequest): Promise<{
        token: string;
        url: string;
        roomName: string;
        identity: string;
    }>;
}
export {};
