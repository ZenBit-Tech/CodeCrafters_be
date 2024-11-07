import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'common/database/entities/user.entity';
import { Roles } from 'common/enums/enums';
import * as jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';

interface InviteTokenPayload extends jwt.Jwt {
  role: Roles;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async authByEmail(email: string, invitationToken: string): Promise<{ token: string } | BadRequestException> {
    try {
      const user: User = await this.userRepo.findOneOrFail({ where: { email } });

      const decodedToken = <InviteTokenPayload>jwt.decode(invitationToken);

      if (decodedToken.role !== user.role) throw new Error();

      const secret: string = this.configService.getOrThrow('JWT_SECRET');
      const token: string = jwt.sign({ fullName: user.full_name, email: user.email, role: user.role }, secret, { expiresIn: '12h' });
      return { token };
    } catch (error) {
      throw new BadRequestException("User with this email isn't exists");
    }
  }
}
