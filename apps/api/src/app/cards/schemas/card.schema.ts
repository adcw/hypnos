import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type CardDocument = Card & Document;

@Schema()
export class Card {
    @Prop()
    cardId: string;

    @Prop({
        required: true,
        unique: true,
    })
    name: string;

    @Prop({
        required: true,
    })
    url: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);