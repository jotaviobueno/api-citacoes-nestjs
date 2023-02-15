import { forwardRef, Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { ISessionRepository } from './repositories/implementations/isession.repository';
import { SessionRepository } from './repositories/session.repository';
import { Session, SessionSchema } from '../../models/session.model';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Session.name, schema: SessionSchema },
        ]),
        forwardRef(() => UserModule),
    ],
    controllers: [SessionController],
    providers: [
        SessionService,
        ISessionRepository,
        {
            provide: SessionRepository,
            useClass: ISessionRepository,
        },
    ],
    exports: [SessionRepository],
})
export class SessionModule {}
