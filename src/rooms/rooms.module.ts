import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RoomsGateway } from './rooms.gateway';
import { RoomMembersModule } from '../room-members/room-members.module';
import { LivekitService } from './livekit.service';

@Module({
  imports: [PrismaModule, RoomMembersModule],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsGateway, LivekitService],
})
export class RoomsModule {}
