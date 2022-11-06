import { Body, Controller, Delete, Get, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AddCardDto } from './dto/add-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

import { Card } from './schemas/card.schema';
import { CardsService } from './cards.service';

@ApiTags('Card')
//localhost/api/cards
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

//localhost/api/cards/1
  @Get(':cardId')
  async getUser(@Param('cardId') cardId: string): Promise<Card> {
    return this.cardsService.getCardById(cardId);
  }

//localhost/api/cards
  @Get()
  async getCards(): Promise<Card[]> {
      return this.cardsService.getCards();
  }

  @Delete(':cardId')
  async removeCard(@Param('cardId') cardId: string): Promise<Card> {
      return this.cardsService.removeCard(cardId);
  }

  @Post()
  @ApiCreatedResponse({
    description: 'Card has been added'
  })
  @ApiBadRequestResponse({
    description: 'Cannot create card'
  })
  async createCard(@Body(ValidationPipe) addCardDto: AddCardDto): Promise<Card> {
      return this.cardsService.createCard(addCardDto.name, addCardDto.url)
  }

  @ApiCreatedResponse({
    description: 'Data has been changed'
  })
  @ApiBadRequestResponse({
    description: 'Cannot change data'
  })
  @Patch(':cardId')
  async updateCard(@Param('cardId') cardId: string, @Body(ValidationPipe) updateCardDto: UpdateCardDto): Promise<Card> {
      return this.cardsService.updateCard(cardId, updateCardDto);
  }
}