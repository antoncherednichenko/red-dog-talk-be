import { RoomMembersService } from './room-members.service';
import { UpdateRoomMemberStatusDto } from './dto/update-room-member.dto';
export declare class RoomMembersController {
    private readonly roomMembersService;
    constructor(roomMembersService: RoomMembersService);
    updateStatus(roomId: string, updateStatusDto: UpdateRoomMemberStatusDto, req: any): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            password: string;
        };
    } & {
        id: string;
        roomId: string;
        userId: string;
        status: import(".prisma/client").$Enums.RoomMemberStatus;
        lastSeen: Date;
        joinedAt: Date;
    }>;
}
