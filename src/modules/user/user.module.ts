import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { DispatcherModule } from './dispatcher/dispatcher.module';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  imports: [AdminModule, DispatcherModule],
})
export class UserModule {}
