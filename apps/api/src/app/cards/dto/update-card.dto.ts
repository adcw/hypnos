import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator'

export class UpdateCardDto {
    
    @ApiProperty({
        description: "Card name",
        example: "plane"
    })
    @IsString()
    @MinLength(1)
    @MaxLength(30)
    name: string;

    @ApiProperty({
        description: "New card source",
        example: "https://dictionary.cambridge.org/pl/images/full/plane_noun_001_12213.jpg?version=5.0.273"
    })
    @IsString()
    @MinLength(3)
    url: string;
}