import { Exclude } from 'class-transformer';
import { User } from '@prisma/client';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  id!: string;
  email!: string;
  name!: string;

  @Exclude()
  password!: string;
}
