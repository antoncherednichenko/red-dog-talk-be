import { IsEnum } from 'class-validator';
import { RoomMemberStatus } from '@prisma/client';

export class UpdateRoomMemberStatusDto {
  @IsEnum(RoomMemberStatus)
  status: RoomMemberStatus;
}
