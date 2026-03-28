import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';
import { ListRoomMessagesDto } from './dto/list-room-messages.dto';

type RoomMessageWithAuthor = Prisma.RoomMessageGetPayload<{
  include: { author: true };
}>;

@Injectable()
export class RoomMessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllForRoom(
    roomId: string,
    userId: string,
    query: ListRoomMessagesDto,
  ) {
    await this.assertRoomMember(roomId, userId);

    const messages = await this.prisma.roomMessage.findMany({
      where: {
        roomId,
        createdAt: query.beforeCreatedAt
          ? { lt: new Date(query.beforeCreatedAt) }
          : undefined,
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: query.limit ?? 50,
    });

    return messages.reverse();
  }

  async createForRoom(
    roomId: string,
    userId: string,
    dto: CreateRoomMessageDto,
  ): Promise<RoomMessageWithAuthor> {
    await this.assertRoomMember(roomId, userId);

    return this.prisma.roomMessage.create({
      data: {
        roomId,
        authorId: userId,
        text: dto.text,
      },
      include: {
        author: true,
      },
    });
  }

  private async assertRoomMember(roomId: string, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      select: { id: true },
    });

    if (!room) {
      throw new NotFoundException(`Room with id ${roomId} not found`);
    }

    const member = await this.prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
      select: { id: true },
    });

    if (!member) {
      throw new ForbiddenException('Only room members can access room chat');
    }
  }
}
