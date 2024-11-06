import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { MailerService } from 'common/mailer/mailer.service';
import { SendEmailInterface } from 'common/types/interfaces';
import * as jwt from 'jsonwebtoken';
import { DataSource, Repository } from 'typeorm';

import { SuperAdminData } from './data';

@Injectable()
export class SeedingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
    private readonly smtpService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async seed() {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const user = await queryRunner.manager.findOne(User, { where: { role: Roles.SUPERADMIN } });

      if (user) return;

      const superAdmin = this.userRepo.create(SuperAdminData);
      await queryRunner.manager.save(superAdmin);

      const secret: string = this.configService.getOrThrow('JWT_SECRET');

      if (!secret) {
        throw new Error('JWT secret is not defined');
      }

      const superAdminToken: string = jwt.sign({ isLogginToken: true, role: Roles.SUPERADMIN }, secret, {
        expiresIn: '1h',
      });

      const mailDto: SendEmailInterface = {
        from: { name: 'codecrafters', address: 'codecrafters@mail.com' },
        recipients: [{ name: superAdmin.full_name, address: superAdmin.email }],
        subject: 'invitation link',
        html: `<a href="http://localhost:5473?inviteToken=${superAdminToken}">invitation link</a>`,
        placeholderReplacements: {},
      };

      await this.smtpService.sendEmail(mailDto);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
