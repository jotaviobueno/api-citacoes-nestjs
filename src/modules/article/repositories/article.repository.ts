import { Types } from 'mongoose';
import { Article } from 'src/models/article.model';
import { CreateArticleDto } from '../dto/create-article.dto';
import { UpdateArticleDto } from '../dto/update-article.dto';

export abstract class ArticleRepository {
    abstract create(
        user_id: Types.ObjectId,
        createArticleDto: CreateArticleDto,
    ): Promise<Article>;
    abstract findAll(): Promise<Article[]>;
    abstract findByArticleId(article_id: string): Promise<Article>;
    abstract update(_id: Types.ObjectId, updateArticleDto: UpdateArticleDto);
    abstract delete(_id: Types.ObjectId);
}
