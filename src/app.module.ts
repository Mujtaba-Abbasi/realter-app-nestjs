import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { HomeService } from './home/home.service';
import { HomeModule } from './home/home.module';

@Module({
  imports: [UserModule, PrismaModule, HomeModule],
  controllers: [AppController],
  providers: [AppService, HomeService],
})
export class AppModule {}
