import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  GenerateAuthTokenParams,
  GenerateProductKeyParams,
  SignInParams,
  SignupParams,
} from 'src/types';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async signup(params: SignupParams) {
    const { email, password } = params;

    const isEmailTaken = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (isEmailTaken) {
      console.log('The email is already taken ');
      throw new ConflictException();
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        ...params,
        password: hashedPassword,
      },
    });

    if (user) {
      delete user.password;

      const token = await this.generateAuthToken({
        id: user.id,
        userType: user.user_type,
      });

      return { token };
    }
  }

  async signIn(params: SignInParams) {
    const { email, password } = params;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('Invalid Credentials', 400);
    }

    const hashedPassword = user.password;

    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatch) {
      throw new HttpException('Invalid Credentials', 400);
    }

    const token = await this.generateAuthToken({
      id: user.id,
      userType: user.user_type,
    });

    return { token };
  }

  async generateProductKey({ email, userType }: GenerateProductKeyParams) {
    return await bcrypt.hash(
      `${email} ${userType} ${process.env.$2a$10$NtiOxn32p8cJ7S5iDak8rejhCTQ5fL3MM4ptitM0FOwGpqUHNzphePRODUCT_KEY_SECRET}`,
      10,
    );
  }

  async generateAuthToken({ id, userType }: GenerateAuthTokenParams) {
    const token = jwt.sign({ id, userType }, process.env.JWT_SECRET, {
      expiresIn: 6600,
    });

    return token;
  }
}
