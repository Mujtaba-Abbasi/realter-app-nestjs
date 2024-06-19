import {
  Body,
  Controller,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService as AuthenticationService } from './auth.service';
import { GenerateProductKeyDto, SignInDto, SignUpDto } from 'src/dtos';
import { UserType } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthenticationService) {}

  @Post('/signup/:userType')
  signup(@Body() body: SignUpDto, @Param('userType') userType: UserType) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        console.log('No product key ');
        throw new UnauthorizedException();
      }
      const productKey = `${body.email} ${userType} ${process.env.PRODUCT_KEY_SECRET}`;

      const isMatch = bcrypt.compare(productKey, body.productKey);

      if (!isMatch) {
        console.log('Product key is not the match ');

        throw new UnauthorizedException();
      }
    }
    delete body.productKey;
    return this.AuthService.signup({ ...body, user_type: userType });
  }

  @Post('/signIn')
  signIn(@Body() body: SignInDto) {
    return this.AuthService.signIn(body);
  }

  @Post('/generateProductKey')
  generateProductKey(@Body() body: GenerateProductKeyDto) {
    return this.AuthService.generateProductKey(body);
  }
}
