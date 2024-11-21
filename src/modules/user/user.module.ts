import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { User } from 'common/database/entities/user.entity';

import { AdminModule } from './admin/admin.module';
import { DispatcherModule } from './dispatcher/dispatcher.module';
import { DriverModule } from './driver/driver.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  imports: [TypeOrmModule.forFeature([User, Company]), AdminModule, DispatcherModule, DriverModule],
  controllers: [UserController],
})
export class UserModule {}
