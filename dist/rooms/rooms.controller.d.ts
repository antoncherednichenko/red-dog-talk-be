import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomEntity } from './entities/room.entity';
import { RoomMemberEntity } from './entities/room.entity';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    create(createRoomDto: CreateRoomDto, req: any): Promise<RoomEntity>;
    findAll(req: any): Promise<{
        name: string;
        id: string;
        type: import(".prisma/client").$Enums.RoomType;
        ownerId: string;
    }[]>;
    findOne(id: string): Promise<RoomEntity>;
    getMembers(id: string): Promise<RoomMemberEntity[]>;
    update(id: string, updateRoomDto: UpdateRoomDto, req: any): Promise<RoomEntity>;
    remove(id: string, req: any): Promise<{
        name: string;
        id: string;
        type: import(".prisma/client").$Enums.RoomType;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
    }>;
    join(id: string, req: any): Promise<{
        id: string;
    }>;
    leave(id: string, req: any): Promise<RoomEntity>;
}
