import { Module } from '@nestjs/common';
import { AttractionsController } from './attractions.controller';
import { AttractionsService } from './attractions.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AttractionsController],
  providers: [AttractionsService],
  exports: [AttractionsService],
})
export class AttractionsModule {}
