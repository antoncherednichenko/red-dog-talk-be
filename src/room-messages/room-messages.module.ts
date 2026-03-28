import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RoomMessagesController } from './room-messages.controller';
import { RoomMessagesService } from './room-messages.service';

@Module({
  imports: [PrismaModule],
  controllers: [RoomMessagesController],
  providers: [RoomMessagesService],
})
export class RoomMessagesModule {}
