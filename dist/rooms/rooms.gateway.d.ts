import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { RoomMembersService } from '../room-members/room-members.service';
import { RoomMemberStatus } from '@prisma/client';
type RoomsSocketData = {
    userId: string | null;
    roomId: string | null;
};
type RoomsSocket = Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, RoomsSocketData>;
export declare class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly roomMembersService;
    server: Server;
    constructor(roomMembersService: RoomMembersService);
    handleConnection(client: RoomsSocket): void;
    handleDisconnect(client: RoomsSocket): Promise<void>;
    handleJoinRoom(client: RoomsSocket, payload: {
        roomId: string;
        userId: string;
    }): Promise<void>;
    handleLeaveRoom(client: RoomsSocket, payload: {
        roomId: string;
        userId: string;
    }): Promise<void>;
    handleUpdateStatus(client: RoomsSocket, payload: {
        roomId: string;
        userId: string;
        status: RoomMemberStatus;
    }): Promise<void>;
    private transformToEntity;
}
export {};
