import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';
import { CreateRoomMessageDto } from './dto/create-room-message.dto';
import { ListRoomMessagesDto } from './dto/list-room-messages.dto';
import { RoomMessagesService } from './room-messages.service';
import { RoomMessageEntity } from './entities/room-message.entity';
import { UserEntity } from '../users/entities/user.entity';

type AuthUser = { id: string; email: string; name: string };
type AuthenticatedRequest = ExpressRequest & { user: AuthUser };
type RoomMessageWithAuthor = Awaited<
  ReturnType<RoomMessagesService['createForRoom']>
>;

@Controller('rooms/:roomId/messages')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
export class RoomMessagesController {
  constructor(private readonly roomMessagesService: RoomMessagesService) {}

  @Get()
  async findAll(
    @Param('roomId') roomId: string,
    @Request() req: AuthenticatedRequest,
    @Query() query: ListRoomMessagesDto,
  ) {
    const messages = await this.roomMessagesService.findAllForRoom(
      roomId,
      req.user.id,
      query,
    );

    return messages.map((message) => this.toEntity(message));
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(
    @Param('roomId') roomId: string,
    @Request() req: AuthenticatedRequest,
    @Body() dto: CreateRoomMessageDto,
  ) {
    const message = await this.roomMessagesService.createForRoom(
      roomId,
      req.user.id,
      dto,
    );

    return this.toEntity(message);
  }

  private toEntity(message: RoomMessageWithAuthor) {
    return new RoomMessageEntity({
      ...message,
      author: new UserEntity(message.author),
    });
  }
}
