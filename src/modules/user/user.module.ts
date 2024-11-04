import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [AdminModule],
})
export class UserModule {}
