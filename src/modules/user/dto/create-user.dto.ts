import {
    IsNotEmpty,
    IsIn,
    IsString,
    MinLength,
    MaxLength,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    first_name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    last_name: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(30)
    password: string;

    @IsString()
    @IsNotEmpty()
    birth_date: Date;

    @IsString()
    @IsNotEmpty()
    avatar_url: string;

    @IsString()
    @IsNotEmpty()
    @IsIn(['masculino', 'feminino'])
    genre: string;
}
