import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './repositories/user.repository';
import { IUserRepository } from './repositories/implementations/iuser.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/models/user.model';
import { SessionModule } from '../session/session.module';
import { AuthModule } from '../auth/auth.module';
import { SessionHelper } from 'src/helper/session/session.Helper';
import { AuthHelper } from 'src/helper/auth/auth.helper';
import { UserHelper } from 'src/helper/user/user.helper';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        forwardRef(() => AuthModule),
        forwardRef(() => SessionModule),
        forwardRef(() => AuthModule),
    ],
    controllers: [UserController],
    providers: [
        UserService,
        IUserRepository,
        SessionHelper,
        AuthHelper,
        UserHelper,
        {
            provide: UserRepository,
            useClass: IUserRepository,
        },
    ],
    exports: [UserRepository],
})
export class UserModule {}
