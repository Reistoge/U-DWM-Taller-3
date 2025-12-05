import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FleetModule } from './fleet/fleet.module';


@Module({
  imports: [FleetModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
