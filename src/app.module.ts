import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { Company } from './common/entities/company.entity';
import { Customer } from './common/entities/customer.entity';
import { LuggageImages } from './common/entities/luggage-imgs.entity';
import { Luggage } from './common/entities/luggage.entity';
import { Notification } from './common/entities/notification.entity';
import { Order } from './common/entities/order.entity';
import { Route } from './common/entities/route.entity';
import { User } from './common/entities/user.entity';
import { ModuleExampleModule } from './modules/module-example/module-example.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TypeOrmModule.forFeature([User, Route, Company, Order, Notification, Luggage, LuggageImages, Customer]),
    ModuleExampleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
