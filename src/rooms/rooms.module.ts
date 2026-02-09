import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RoomsGateway } from './rooms.gateway';
import { RoomMembersModule } from '../room-members/room-members.module';

@Module({
  imports: [PrismaModule, RoomMembersModule],
  controllers: [RoomsController],
  providers: [RoomsService, RoomsGateway],
})
export class RoomsModule {}
