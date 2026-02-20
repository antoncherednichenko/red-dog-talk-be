import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoomEntity } from './entities/room.entity';

import { RoomMemberEntity } from './entities/room.entity';
import { UserEntity } from '../users/entities/user.entity';

@Controller('rooms')
@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(@Body() createRoomDto: CreateRoomDto, @Request() req) {
    const room = await this.roomsService.create(createRoomDto, req.user.id);
    return new RoomEntity(room);
  }

  @Get()
  async findAll(@Request() req) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException();
    }
    const rooms = await this.roomsService.findAll(userId);
    return rooms.map((room) => new RoomEntity(room));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const room = await this.roomsService.findOne(id);
    return new RoomEntity(room);
  }

  @Get(':id/members')
  async getMembers(@Param('id') id: string) {
    const members = await this.roomsService.getMembers(id);
    return members.map(
      (m) =>
        new RoomMemberEntity({
          ...m,
          user: new UserEntity(m.user),
        }),
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @Request() req,
  ) {
    const room = await this.roomsService.update(id, updateRoomDto, req.user.id);
    return new RoomEntity(room);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return this.roomsService.remove(id, req.user.id);
  }

  @Post(':id/join')
  @HttpCode(HttpStatus.OK)
  async join(@Param('id') id: string, @Request() req) {
    const room = await this.roomsService.join(id, req.user.id);
    return { id: room.id };
  }

  @Post(':id/leave')
  @HttpCode(HttpStatus.OK)
  async leave(@Param('id') id: string, @Request() req) {
    const room = await this.roomsService.leave(id, req.user.id);
    return new RoomEntity(room);
  }
}
