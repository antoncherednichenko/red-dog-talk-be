import {
  Controller,
  Patch,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { RoomMembersService } from './room-members.service';
import { UpdateRoomMemberStatusDto } from './dto/update-room-member.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request as ExpressRequest } from 'express';

type AuthUser = { id: string; email: string; name: string };
type AuthenticatedRequest = ExpressRequest & { user: AuthUser };

@Controller('room-members')
@UseGuards(AuthGuard('jwt'))
export class RoomMembersController {
  constructor(private readonly roomMembersService: RoomMembersService) {}

  @Patch(':roomId/status')
  updateStatus(
    @Param('roomId') roomId: string,
    @Body() updateStatusDto: UpdateRoomMemberStatusDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.roomMembersService.updateStatus(
      roomId,
      req.user.id,
      updateStatusDto.status,
    );
  }
}
