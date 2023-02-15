import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenToDeleteAccountDto {
    @IsString()
    @IsNotEmpty()
    password: string;
}
