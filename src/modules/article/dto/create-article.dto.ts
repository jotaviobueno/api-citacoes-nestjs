import { IsNotEmpty, IsString } from 'class-validator';

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    author: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}
