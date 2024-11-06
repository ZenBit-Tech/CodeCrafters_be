import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  imports: [AdminModule],
})
export class UserModule {}
