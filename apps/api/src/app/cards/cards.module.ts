import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Card, CardSchema } from "./schemas/card.schema";
import { CardsController } from "./cards.controller";
import { CardsRepository } from "./cards.repository";
import { CardsService } from "./cards.service";

@Module({
    imports: [MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }])],
    controllers: [CardsController],
    providers: [CardsService, CardsRepository]
})
export class CardsModule {}