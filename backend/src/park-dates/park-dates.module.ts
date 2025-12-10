import { Module } from '@nestjs/common';
import { ParkDatesService } from './park-dates.service';
import { ParkDatesController } from './park-dates.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ParkDatesController],
  providers: [ParkDatesService],
})
export class ParkDatesModule {}
