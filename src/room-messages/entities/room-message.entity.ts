import { RoomMessage } from '@prisma/client';
import { UserEntity } from '../../users/entities/user.entity';

export class RoomMessageEntity implements RoomMessage {
  constructor(partial: Partial<RoomMessageEntity>) {
    Object.assign(this, partial);
  }

  id: string;
  roomId: string;
  authorId: string;
  text: string;
  createdAt: Date;
  author: UserEntity;
}
