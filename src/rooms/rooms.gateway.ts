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
import { RoomMembersService } from '../room-members/room-members.service';
import { RoomMemberStatus } from '@prisma/client';

import { UserEntity } from '../users/entities/user.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomMembersService: RoomMembersService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const userId = client.data.userId;
    const roomId = client.data.roomId;

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
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; userId: string },
  ) {
    const { roomId, userId } = payload;
    client.join(roomId);
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
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomId: string; userId: string },
  ) {
    const { roomId, userId } = payload;
    client.leave(roomId);
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
    @ConnectedSocket() client: Socket,
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

  private transformToEntity(member: any) {
    // Manual transformation similar to what RoomEntity does via class-transformer
    // but applied to a single member object
    if (member.user) {
      return {
        ...member,
        user: new UserEntity(member.user),
      };
    }
    return member;
  }
}
