import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";

import { Card, CardDocument } from "./schemas/card.schema";

@Injectable()
export class CardsRepository {
    constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

    async findOne(cardFilterQuery: FilterQuery<Card>): Promise<Card> {
        return this.cardModel.findOne(cardFilterQuery);
    }

    async find(cardsFilterQuery: FilterQuery<Card>): Promise<Card[]> {
        return this.cardModel.find(cardsFilterQuery)
    }

    async remove(card: Card): Promise<Card> {
        const removeCard = new this.cardModel(card);
        return removeCard.deleteOne();
    }

    async create(card: Card): Promise<Card> {
        const newCard = new this.cardModel(card);
        return newCard.save()
    }

    async findOneAndUpdate(cardFilterQuery: FilterQuery<Card>, card: Partial<Card>): Promise<Card> {
        return this.cardModel.findOneAndUpdate(cardFilterQuery, card, { new: true });
    }
}