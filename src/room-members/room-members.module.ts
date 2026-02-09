import { Module } from '@nestjs/common';
import { RoomMembersService } from './room-members.service';
import { RoomMembersController } from './room-members.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RoomMembersController],
  providers: [RoomMembersService],
  exports: [RoomMembersService],
})
export class RoomMembersModule {}
