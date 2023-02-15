import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ArticleDocument, Article } from 'src/models/article.model';
import { CreateArticleDto } from '../../dto/create-article.dto';
import { UpdateArticleDto } from '../../dto/update-article.dto';
import { ArticleRepository } from '../article.repository';

@Injectable()
export class IArticleRepository implements ArticleRepository {
    constructor(
        @InjectModel(Article.name)
        private readonly articleModel: Model<ArticleDocument>,
    ) {}

    async create(
        user_id: Types.ObjectId,
        createArticleDto: CreateArticleDto,
    ): Promise<Article> {
        const article = new this.articleModel({
            user_id,
            ...createArticleDto,
        });

        return article.save();
    }

    async findAll(): Promise<Article[]> {
        return await this.articleModel.find({ deleted_at: null }).select({
            _id: 0,
            user_id: 0,
            deleted_at: 0,
            __v: 0,
            created_at: 0,
            updated_at: 0,
        });
    }

    async findByArticleId(article_id: string): Promise<Article> {
        return await this.articleModel.findOne({
            article_id,
            deleted_at: null,
        });
    }

    async update(_id: Types.ObjectId, updateArticleDto: UpdateArticleDto) {
        return await this.articleModel.updateOne(
            { _id, deleted_at: null },
            { ...updateArticleDto, updated_at: new Date() },
        );
    }

    async delete(_id: Types.ObjectId) {
        return await this.articleModel.updateOne(
            { _id, deleted_at: null },
            {
                deleted_at: new Date(),
                updated_at: new Date(),
            },
        );
    }
}
