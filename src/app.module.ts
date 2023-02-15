import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/user/user.module';
import { SessionModule } from './modules/session/session.module';
import { AuthModule } from './modules/auth/auth.module';
import { ArticleModule } from './modules/article/article.module';

@Module({
    imports: [
        MongooseModule.forRoot(process.env.MONGO_URI),
        UserModule,
        SessionModule,
        AuthModule,
        ArticleModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
