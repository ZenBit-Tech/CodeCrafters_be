import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'common/database/entities/company.entity';
import { Customer } from 'common/database/entities/customer.entity';
import { LuggageImages } from 'common/database/entities/luggage-imgs.entity';
import { Luggage } from 'common/database/entities/luggage.entity';
import { Notification } from 'common/database/entities/notification.entity';
import { Order } from 'common/database/entities/order.entity';
import { Route } from 'common/database/entities/route.entity';
import { User } from 'common/database/entities/user.entity';
import { CompanyModule } from 'modules/company/company.module';
import { NotificationsModule } from 'modules/notifications/notifications.module';

import { DatabaseModule } from './common/database/database.module';
import { MailerModule } from './common/mailer/mailer.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomersModule } from './modules/customers/customers.module';
import { ModuleExampleModule } from './modules/module-example/module-example.module';
import { OrdersModule } from './modules/orders/orders.module';
import { RouteModule } from './modules/route/route.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    TypeOrmModule.forFeature([User, Route, Company, Order, Notification, Luggage, LuggageImages, Customer]),
    ModuleExampleModule,
    MailerModule,
    AuthModule,
    UserModule,
    CompanyModule,
    OrdersModule,
    RouteModule,
    NotificationsModule,
    TicketsModule,
    CustomersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
