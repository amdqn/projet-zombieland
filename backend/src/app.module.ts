import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ActivitiesModule } from './activities/activities.module';
import { AttractionsModule } from './attractions/attractions.module';

@Module({
  imports: [PrismaModule, AuthModule, ActivitiesModule, AttractionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
