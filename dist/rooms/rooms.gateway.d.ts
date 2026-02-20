import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomMembersService } from '../room-members/room-members.service';
import { RoomMemberStatus } from '@prisma/client';
export declare class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly roomMembersService;
    server: Server;
    constructor(roomMembersService: RoomMembersService);
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): Promise<void>;
    handleJoinRoom(client: Socket, payload: {
        roomId: string;
        userId: string;
    }): Promise<void>;
    handleLeaveRoom(client: Socket, payload: {
        roomId: string;
        userId: string;
    }): Promise<void>;
    handleUpdateStatus(client: Socket, payload: {
        roomId: string;
        userId: string;
        status: RoomMemberStatus;
    }): Promise<void>;
    private transformToEntity;
}
