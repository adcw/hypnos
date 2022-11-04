import { IsString, MinLength, MaxLength, Matches } from 'class-validator'

export class CreateUserDto {

    @IsString()
    @MinLength(6)
    @MaxLength(30)
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