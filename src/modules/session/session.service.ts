import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionRepository } from './repositories/session.repository';
import {
    newSession,
    sessionTransformer,
} from './transformer/session.transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SessionService {
    constructor(
        private readonly sessionRepository: SessionRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async create(
        createSessionDto: CreateSessionDto,
        addressIp: string,
        userAgent: string,
    ): Promise<newSession> {
        const user = await this.userRepository.findByEmail(
            createSessionDto.email,
        );

        if (!user) throw new UnauthorizedException('not authorized.');

        const comparePassword = await bcrypt.compare(
            createSessionDto.password,
            user.password,
        );

        if (!comparePassword)
            throw new UnauthorizedException('not authorized.');

        const session = await this.sessionRepository.create(
            user._id,
            createSessionDto,
            addressIp,
            userAgent,
        );

        return sessionTransformer(session);
    }

    async disconnect(session_id: string) {
        if (!session_id) throw new BadRequestException('invalid session.');

        const update = await this.sessionRepository.disconnectBySessionId(
            session_id,
        );

        if (update.modifiedCount != 1)
            throw new UnprocessableEntityException('try again.');

        return { success: 'session disconnected.' };
    }
}
