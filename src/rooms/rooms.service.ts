import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RoomMemberStatus } from '@prisma/client';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRoomDto: CreateRoomDto, userId: string) {
    // Create room and add creator as member
    return this.prisma.room.create({
      data: {
        ...createRoomDto,
        ownerId: userId,
        members: {
          create: {
            userId: userId,
            status: RoomMemberStatus.ONLINE,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    // Return only rooms where user is a member
    return this.prisma.room.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        ownerId: true,
        type: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });
    if (!room) {
      throw new NotFoundException(`Room with id ${id} not found`);
    }
    return room;
  }

  async getMembers(roomId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!room) {
      throw new NotFoundException(`Room with id ${roomId} not found`);
    }
    return room.members;
  }

  async update(id: string, updateRoomDto: UpdateRoomDto, userId: string) {
    const room = await this.findOne(id);
    if (room.ownerId !== userId) {
      throw new BadRequestException('Only owner can update the room');
    }

    return this.prisma.room.update({
      where: { id },
      data: updateRoomDto,
    });
  }

  async remove(id: string, userId: string) {
    const room = await this.findOne(id);
    if (room.ownerId !== userId) {
      throw new BadRequestException('Only owner can delete the room');
    }
    return this.prisma.room.delete({
      where: { id },
    });
  }

  async join(roomId: string, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: { members: true },
    });

    if (!room) {
      throw new NotFoundException(`Room with id ${roomId} not found`);
    }

    // Check if already member
    const isMember = room.members.some((m) => m.userId === userId);
    if (isMember) {
      return room; // Already member, just return
    }

    // Check limit
    if (room.members.length >= 5) {
      throw new BadRequestException('Room is full (max 5 members)');
    }

    // Add member
    await this.prisma.roomMember.create({
      data: {
        roomId,
        userId,
        status: RoomMemberStatus.ONLINE,
      },
    });

    return this.findOne(roomId);
  }

  async leave(roomId: string, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      include: { members: true },
    });

    if (!room) {
      throw new NotFoundException(`Room with id ${roomId} not found`);
    }

    const member = room.members.find((m) => m.userId === userId);
    if (!member) {
      throw new BadRequestException('User is not a member of this room');
    }

    await this.prisma.roomMember.delete({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
    });

    return this.findOne(roomId);
  }
}
