import { Module } from '@nestjs/common';
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

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
