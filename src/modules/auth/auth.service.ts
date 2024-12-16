import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import { MailerService } from 'common/mailer/mailer.service';
import { SuccessResponse } from 'common/types/response-success.dto';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';

import { AuthDriverOtpResponseDto } from './dto/auth-driver-otp-response.dto';

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

      const companyName: string = user.role === Roles.SUPERADMIN ? '' : user.company_id.name;

      await this.smtpService.sendDynamicEmail({
        from: { name: this.configService.getOrThrow('APP_NAME'), address: this.configService.getOrThrow('DEFAULT_EMAIL_FROM') },
        recipients: user.email,
        subject: 'Welcome to Codecrafters',
        content: {
          fullName: user.company_id.name,
          companyName,
          additionalInfo: 'Click the link below to complete your registration.',
        },
        footerEmail: user.email,
        isAdmin: user.role !== Roles.DRIVER,
        isSuperAdmin: user.role === Roles.SUPERADMIN,
        token,
      });

      return { status: 200, message: 'You logged in successfully. Check your email.' };
    } catch (error) {
      throw new BadRequestException("User with this email doesn't exist.");
    }
  }

  async tokenValidation(accessToken: string, role: Roles): Promise<{ token: string; role: Roles; companyId: number }> {
    try {
      const { email } = <jwt.JwtPayload>jwt.verify(accessToken, this.configService.getOrThrow('JWT_SECRET'));

      if (typeof email !== 'string') {
        throw new BadRequestException('Invalid token payload');
      }

      const user = await this.userRepo.findOneOrFail({
        where: { email },
        relations: ['company_id'],
      });

      const { id: companyId } = user.company_id;

      return { token: accessToken, role, companyId };
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }

  async authDriverByEmail(email: string): Promise<SuccessResponse> {
    try {
      const user: User = await this.userRepo.findOneOrFail({ where: { email } });

      if (user.role !== Roles.DRIVER) {
        throw new BadRequestException("User with this email isn't a driver");
      }

      const companyName: string = user.company_id.name;

      const otp: string = this.generateOtp();
      const otpExpiry = new Date();
      const otpValidMinutes = 1;
      otpExpiry.setMinutes(otpExpiry.getMinutes() + otpValidMinutes);

      user.otp = otp;
      user.otpExpiry = otpExpiry;

      await this.userRepo.save(user);

      await this.smtpService.sendDynamicEmail({
        from: { name: this.configService.getOrThrow('APP_NAME'), address: this.configService.getOrThrow('DEFAULT_EMAIL_FROM') },
        recipients: user.email,
        subject: 'Welcome to Codecrafters',
        content: {
          fullName: user.full_name,
          companyName,
          additionalInfo: 'Log in by entering the verification code:',
        },
        footerEmail: user.email,
        otp,
      });

      return { status: 200, message: 'You logged in successfully. Check your email.' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to send email to driver');
    }
  }

  async verifyDriverOtp(email: string, otp: string): Promise<AuthDriverOtpResponseDto> {
    try {
      const user: User = await this.userRepo.findOneOrFail({ where: { email } });

      if (user.role !== Roles.DRIVER) {
        throw new BadRequestException("User with this email isn't a driver");
      }

      if (!!user.otpExpiry && (!user.otp || user.otpExpiry < new Date())) {
        throw new BadRequestException('OTP expired or not found');
      }

      if (user.otp !== otp) {
        throw new BadRequestException('Invalid OTP');
      }

      user.otp = undefined;
      user.otpExpiry = undefined;
      await this.userRepo.save(user);

      const { role } = user;

      const secret: string = this.configService.getOrThrow('JWT_SECRET');
      const accessToken: string = jwt.sign(
        { fullName: user.full_name, email: user.email, role: user.role, company_id: user.company_id },
        secret,
        {
          expiresIn: '24h',
        },
      );

      return {
        token: accessToken,
        role,
        user: {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone_number: user.phone_number,
          companyId: user.company_id.id,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to verify OTP`);
    }
  }

  private generateOtp(): string {
    return crypto.randomInt(100000, 999999).toString();
  }
}
