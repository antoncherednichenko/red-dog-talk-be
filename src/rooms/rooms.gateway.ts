import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { RoomMembersService } from '../room-members/room-members.service';
import { Prisma, RoomMemberStatus } from '@prisma/client';

import { UserEntity } from '../users/entities/user.entity';

type RoomsSocketData = { userId: string | null; roomId: string | null };
type RoomsSocket = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  RoomsSocketData
>;
type RoomMemberWithUser = Prisma.RoomMemberGetPayload<{
  include: { user: true };
}>;

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomMembersService: RoomMembersService) {}

  handleConnection(client: RoomsSocket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: RoomsSocket) {
    console.log(`Client disconnected: ${client.id}`);
    const { userId, roomId } = client.data;

    if (userId && roomId) {
      const member = await this.roomMembersService.updateStatus(
        roomId,
        userId,
        RoomMemberStatus.OFFLINE,
      );
      const memberEntity = this.transformToEntity(member);
      this.server.to(roomId).emit('member:status_changed', memberEntity);
    }
  }

  @SubscribeMessage('room:join')
  async handleJoinRoom(
    @ConnectedSocket() client: RoomsSocket,
    @MessageBody() payload: { roomId: string; userId: string },
  ) {
    const { roomId, userId } = payload;
    await client.join(roomId);
    client.data.userId = userId;
    client.data.roomId = roomId;

    const member = await this.roomMembersService.updateStatus(
      roomId,
      userId,
      RoomMemberStatus.ONLINE,
    );
    const memberEntity = this.transformToEntity(member);
    this.server.to(roomId).emit('member:status_changed', memberEntity);
  }

  @SubscribeMessage('room:leave')
  async handleLeaveRoom(
    @ConnectedSocket() client: RoomsSocket,
    @MessageBody() payload: { roomId: string; userId: string },
  ) {
    const { roomId, userId } = payload;
    await client.leave(roomId);
    client.data.userId = null;
    client.data.roomId = null;

    const member = await this.roomMembersService.updateStatus(
      roomId,
      userId,
      RoomMemberStatus.OFFLINE,
    );
    const memberEntity = this.transformToEntity(member);
    this.server.to(roomId).emit('member:status_changed', memberEntity);
  }

  @SubscribeMessage('member:update_status')
  async handleUpdateStatus(
    @ConnectedSocket() client: RoomsSocket,
    @MessageBody()
    payload: { roomId: string; userId: string; status: RoomMemberStatus },
  ) {
    const { roomId, userId, status } = payload;
    const member = await this.roomMembersService.updateStatus(
      roomId,
      userId,
      status,
    );
    const memberEntity = this.transformToEntity(member);
    this.server.to(roomId).emit('member:status_changed', memberEntity);
  }

  private transformToEntity(member: RoomMemberWithUser) {
    return {
      ...member,
      user: new UserEntity(member.user),
    };
  }
}
