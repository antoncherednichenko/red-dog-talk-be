import { PrismaService } from '../prisma/prisma.service';
import { RoomMemberStatus } from '@prisma/client';
export declare class RoomMembersService {
    private prisma;
    constructor(prisma: PrismaService);
    updateStatus(roomId: string, userId: string, status: RoomMemberStatus): Promise<{
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
