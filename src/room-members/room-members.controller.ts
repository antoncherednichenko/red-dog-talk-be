import { Controller, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { RoomMembersService } from './room-members.service';
import { UpdateRoomMemberStatusDto } from './dto/update-room-member.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('room-members')
@UseGuards(AuthGuard('jwt'))
export class RoomMembersController {
  constructor(private readonly roomMembersService: RoomMembersService) {}

  @Patch(':roomId/status')
  updateStatus(
    @Param('roomId') roomId: string,
    @Body() updateStatusDto: UpdateRoomMemberStatusDto,
    @Request() req,
  ) {
    return this.roomMembersService.updateStatus(roomId, req.user.id, updateStatusDto.status);
  }
}
