import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator'

export class AddCardDto {

    @ApiProperty({
        description: "Card name",
        example: "plane"
    })
    @IsString()
    @MinLength(1)
    @MaxLength(30)
    name: string;
    
    @ApiProperty({
        description: "Card source",
        example: "https://dictionary.cambridge.org/pl/images/full/plane_noun_001_12213.jpg?version=5.0.273"
    })
    @IsString()
    @MinLength(3)
    url: string;
}