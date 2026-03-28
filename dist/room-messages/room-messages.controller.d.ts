import { Request as ExpressRequest } from 'express';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';
import { ListRoomMessagesDto } from './dto/list-room-messages.dto';
import { RoomMessagesService } from './room-messages.service';
import { RoomMessageEntity } from './entities/room-message.entity';
type AuthUser = {
    id: string;
    email: string;
    name: string;
};
type AuthenticatedRequest = ExpressRequest & {
    user: AuthUser;
};
export declare class RoomMessagesController {
    private readonly roomMessagesService;
    constructor(roomMessagesService: RoomMessagesService);
    findAll(roomId: string, req: AuthenticatedRequest, query: ListRoomMessagesDto): Promise<RoomMessageEntity[]>;
    create(roomId: string, req: AuthenticatedRequest, dto: CreateRoomMessageDto): Promise<RoomMessageEntity>;
    private toEntity;
}
export {};
