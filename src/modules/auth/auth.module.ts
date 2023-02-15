import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from './repositories/auth.repository';
import { IAuthRepository } from './repositories/implementations/iauth.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from '../../models/auth.model';
import { UserModule } from '../user/user.module';
import { SessionModule } from '../session/session.module';
import { SessionHelper } from 'src/helper/session/session.Helper';
import { UserHelper } from 'src/helper/user/user.helper';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
        forwardRef(() => UserModule),
        SessionModule,
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        IAuthRepository,
        SessionHelper,
        UserHelper,
        {
            provide: AuthRepository,
            useClass: IAuthRepository,
        },
    ],
    exports: [AuthRepository],
})
export class AuthModule {}
