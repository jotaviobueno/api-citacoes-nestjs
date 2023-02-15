import { forwardRef, Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { IArticleRepository } from './repositories/implementations/iarticle.repository';
import { ArticleRepository } from './repositories/article.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from 'src/models/article.model';
import { SessionModule } from '../session/session.module';
import { SessionHelper } from 'src/helper/session/session.Helper';
import { UserModule } from '../user/user.module';
import { UserHelper } from 'src/helper/user/user.helper';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Article.name, schema: ArticleSchema },
        ]),
        forwardRef(() => UserModule),
        SessionModule,
    ],
    controllers: [ArticleController],
    providers: [
        ArticleService,
        IArticleRepository,
        SessionHelper,
        UserHelper,
        {
            provide: ArticleRepository,
            useClass: IArticleRepository,
        },
    ],
})
export class ArticleModule {}
