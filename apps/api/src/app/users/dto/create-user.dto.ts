import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator'

export class CreateUserDto {

    @ApiProperty({
        description: "New user email",
        example: "damian@gmail.com"
    })
    @IsString()
    @MinLength(6)
    @MaxLength(30)
    @Matches(
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    {
        message: 'incorrect email address'
    })
    email: string;
    
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