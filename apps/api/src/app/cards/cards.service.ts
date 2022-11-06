import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';
import { UpdateCardDto } from "./dto/update-card.dto";

import { Card } from "./schemas/card.schema";
import { CardsRepository } from "./cards.repository";

@Injectable()
export class CardsService {
    constructor(private readonly cardsRepository: CardsRepository) {}

    async getCardById(cardId: string): Promise<Card> {
        return this.cardsRepository.findOne({ cardId: cardId })
    }

    async getCards(): Promise<Card[]> {
        return this.cardsRepository.find({});
    }

    async removeCard(cardId: string): Promise<Card> {
        const card = await this.cardsRepository.findOne({ cardId: cardId });
        return this.cardsRepository.remove(card);
    }

    async createCard(name: string, url: string): Promise<Card> {
        return this.cardsRepository.create({
            cardId: uuidv4(),
            name,
            url,
        })
    }

    async updateCard(cardId: string, cardUpdates: UpdateCardDto): Promise<Card> {
        return this.cardsRepository.findOneAndUpdate({ cardId }, cardUpdates);
    }
}