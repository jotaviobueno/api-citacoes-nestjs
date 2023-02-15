import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSessionDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
