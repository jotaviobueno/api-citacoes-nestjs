import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTokenToChangePasswordDto {
    @IsString()
    @IsNotEmpty()
    email: string;
}
