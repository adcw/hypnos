import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './cards/cards.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/demo'), UsersModule, CardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
