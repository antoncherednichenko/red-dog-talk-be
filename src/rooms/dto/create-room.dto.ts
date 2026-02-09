import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { RoomType } from '@prisma/client';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(RoomType)
  @IsNotEmpty()
  type: RoomType;
}
