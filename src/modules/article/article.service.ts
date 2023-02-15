import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { SessionHelper } from 'src/helper/session/session.Helper';
import { UserHelper } from 'src/helper/user/user.helper';
import { Article } from 'src/models/article.model';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleRepository } from './repositories/article.repository';
import {
    articleTransformer,
    newArticle,
} from './transformer/session.transformer';

@Injectable()
export class ArticleService {
    constructor(
        private readonly articleRepository: ArticleRepository,
        private readonly sessionHelper: SessionHelper,
        private readonly userHelper: UserHelper,
    ) {}

    async create(
        session_id: string,
        createArticleDto: CreateArticleDto,
    ): Promise<newArticle> {
        const session = await this.sessionHelper.handleSession(session_id);
        const user = await this.userHelper.getUser(session.user_id);

        const article = await this.articleRepository.create(
            user._id,
            createArticleDto,
        );

        return articleTransformer(article);
    }

    async findAll(): Promise<Article[]> {
        return await this.articleRepository.findAll();
    }

    async findOne(article_id: string) {
        const article = await this.articleRepository.findByArticleId(
            article_id,
        );

        if (!article) throw new NotFoundException('article not found.');

        return articleTransformer(article);
    }

    async update(
        article_id: string,
        session_id: string,
        updateArticleDto: UpdateArticleDto,
    ) {
        const session = await this.sessionHelper.handleSession(session_id);
        const user = await this.userHelper.getUser(session.user_id);
        const article = await this.articleRepository.findByArticleId(
            article_id,
        );

        if (!article) throw new NotFoundException('article not found.');

        if (user._id.toString() != article.user_id.toString())
            throw new UnauthorizedException('not authorized.');

        const update = await this.articleRepository.update(
            article._id,
            updateArticleDto,
        );

        if (update.modifiedCount != 1)
            throw new UnprocessableEntityException('try again.');

        return { success: 'article updated.' };
    }

    async remove(session_id: string, article_id: string) {
        const session = await this.sessionHelper.handleSession(session_id);
        const user = await this.userHelper.getUser(session.user_id);
        const article = await this.articleRepository.findByArticleId(
            article_id,
        );

        if (!article) throw new NotFoundException('article not found.');

        if (user._id.toString() != article.user_id.toString())
            throw new UnauthorizedException('not authorized.');

        const update = await this.articleRepository.delete(article._id);

        if (update.modifiedCount != 1)
            throw new UnprocessableEntityException('try again.');

        return { success: 'article deleted' };
    }
}
