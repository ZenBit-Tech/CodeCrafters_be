import { Module } from '@nestjs/common';

import { AdminModule } from './admin/admin.module';
import { DispatcherModule } from './dispatcher/dispatcher.module';
import { DriverModule } from './driver/driver.module';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  imports: [AdminModule, DispatcherModule, DriverModule],
})
export class UserModule {}
