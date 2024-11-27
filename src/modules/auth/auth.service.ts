import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { createUserInvitationMail } from 'common/helpers/createEmailTemplates';
import { MailerService } from 'common/mailer/mailer.service';
import { SuccessResponse } from 'common/types/response-success.dto';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
      @InjectRepository(User)
      private readonly userRepo: Repository<User>,
      private readonly configService: ConfigService,
      private readonly smtpService: MailerService,
  ) {}

  async authByEmail(email: string): Promise<SuccessResponse> {
    try {
      const user: User = await this.userRepo.findOneOrFail({ where: { email } });

      const secret: string = this.configService.getOrThrow('JWT_SECRET');
      const token: string = jwt.sign(
          { fullName: user.full_name, email: user.email, role: user.role, company_id: user.company_id },
          secret,
          { expiresIn: '24h' },
      );

      const userCompany: string = user.role === Roles.SUPERADMIN ? '' : user.company_id.name;

      await this.smtpService.sendEmail({
        from: { name: this.configService.getOrThrow('APP_NAME'), address: this.configService.getOrThrow('DEFAULT_EMAIL_FROM') },
        recipients: [{ name: user.full_name, address: user.email }],
        subject: 'Invitation Link',
        html: createUserInvitationMail({
          companyName: userCompany,
          username: user.full_name,
          token,
        }),
        placeholderReplacements: {},
      });

      return { status: 200, message: 'You logged in successfully check your email' };
    } catch (error) {
      throw new BadRequestException("User with this email isn't exists");
    }
  }

  tokenValidation(accessToken: string, role: Roles): { token: string; role: Roles } {
    return { token: accessToken, role };
  }
}
