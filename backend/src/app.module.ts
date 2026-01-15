import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ActivitiesModule } from './activities/activities.module';
import { AttractionsModule } from './attractions/attractions.module';
import { ReservationsModule } from './reservations/reservations.module';
import { CategoriesModule } from './categories/categories.module';
import { PricesModule } from './prices/prices.module';
import { ParkDatesModule } from './park-dates/park-dates.module';
import { UsersModule } from './users/users.module';
import { MapModule } from './map/map.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,  
      limit: 100,  
    }]),
    PrismaModule,
    AuthModule,
    ActivitiesModule,
    AttractionsModule,
    ReservationsModule,
    CategoriesModule,
    PricesModule,
    ParkDatesModule,
    UsersModule,
    MapModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
