import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator'

export class UpdateUserDto {
    @ApiProperty({
        description: "New user password",
        example: "Abbbbbb1!"
    })
    @IsString()
    @MinLength(6)
    @MaxLength(30)
    @Matches(
        /((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
    {
        message: 'password too weak'
    })
    password: string;
}