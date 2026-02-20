import { PrismaService } from '../prisma/prisma.service';
import { RoomMemberStatus } from '@prisma/client';
export declare class RoomMembersService {
    private prisma;
    constructor(prisma: PrismaService);
    updateStatus(roomId: string, userId: string, status: RoomMemberStatus): Promise<{
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
