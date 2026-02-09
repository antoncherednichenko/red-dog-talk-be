import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoomMemberStatus } from '@prisma/client';

@Injectable()
export class RoomMembersService {
  constructor(private prisma: PrismaService) {}

  async updateStatus(roomId: string, userId: string, status: RoomMemberStatus) {
    const member = await this.prisma.roomMember.findUnique({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
    });

    if (!member) {
      throw new NotFoundException('Member not found in room');
    }

    return this.prisma.roomMember.update({
      where: {
        roomId_userId: {
          roomId,
          userId,
        },
      },
      data: {
        status,
        lastSeen: new Date(),
      },
      include: {
        user: true,
      },
    });
  }
}
