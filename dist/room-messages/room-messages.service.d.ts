import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';
import { ListRoomMessagesDto } from './dto/list-room-messages.dto';
type RoomMessageWithAuthor = Prisma.RoomMessageGetPayload<{
    include: {
        author: true;
    };
}>;
export declare class RoomMessagesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllForRoom(roomId: string, userId: string, query: ListRoomMessagesDto): Promise<({
        author: {
            email: string;
            name: string;
            password: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        roomId: string;
        text: string;
        authorId: string;
    })[]>;
    createForRoom(roomId: string, userId: string, dto: CreateRoomMessageDto): Promise<RoomMessageWithAuthor>;
    private assertRoomMember;
}
export {};
