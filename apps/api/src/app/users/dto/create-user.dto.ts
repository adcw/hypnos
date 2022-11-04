import { IsString, MinLength, MaxLength, Matches } from 'class-validator'

export class CreateUserDto {

    @IsString()
    @MinLength(6)
    @MaxLength(30)
    @Matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
    {
        message: 'incorrect email address'
    })
    email: string;
    
    @IsString()
    @MinLength(6)
    @MaxLength(30)
    @Matches(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
    {
        message: 'password too weak'
    })
    password: string;
}