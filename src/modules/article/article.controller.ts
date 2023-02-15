import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Headers,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('article')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Post()
    create(
        @Headers('session_id') session_id: string,
        @Body() createArticleDto: CreateArticleDto,
    ) {
        return this.articleService.create(session_id, createArticleDto);
    }

    @Get()
    findAll() {
        return this.articleService.findAll();
    }

    @Get(':article_id')
    findOne(@Param('article_id') article_id: string) {
        return this.articleService.findOne(article_id);
    }

    @Patch(':article_id')
    update(
        @Headers('session_id') session_id: string,
        @Param('article_id') article_id: string,
        @Body() updateArticleDto: UpdateArticleDto,
    ) {
        return this.articleService.update(
            article_id,
            session_id,
            updateArticleDto,
        );
    }

    @Delete(':article_id')
    remove(
        @Headers('session_id') session_id: string,
        @Param('article_id') article_id: string,
    ) {
        return this.articleService.remove(session_id, article_id);
    }
}
