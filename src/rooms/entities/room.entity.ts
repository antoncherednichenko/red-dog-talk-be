import { Room, RoomType, RoomMemberStatus } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity';
import { Transform } from 'class-transformer';

export class RoomMemberEntity {
  id: string;
  status: RoomMemberStatus;
  lastSeen: Date;
  joinedAt: Date;
  user: UserEntity;

  constructor(partial: Partial<RoomMemberEntity>) {
    Object.assign(this, partial);
  }
}

export class RoomEntity implements Room {
  id: string;
  name: string;
  type: RoomType;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<RoomEntity>) {
    Object.assign(this, partial);
  }
}
