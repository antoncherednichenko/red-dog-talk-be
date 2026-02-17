import { RoomMembersService } from './room-members.service';
import { UpdateRoomMemberStatusDto } from './dto/update-room-member.dto';
export declare class RoomMembersController {
    private readonly roomMembersService;
    constructor(roomMembersService: RoomMembersService);
    updateStatus(roomId: string, updateStatusDto: UpdateRoomMemberStatusDto, req: any): Promise<{
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
    }>;
}
