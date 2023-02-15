import { BadRequestException, Injectable } from '@nestjs/common';
import { Session } from 'src/models/session.model';
import { SessionRepository } from 'src/modules/session/repositories/session.repository';

@Injectable()
export class SessionHelper {
    constructor(private readonly sessionRepository: SessionRepository) {}

    async handleSession(session_id: string): Promise<Session> {
        const session = await this.sessionRepository.findBySessionId(
            session_id,
        );

        if (!session)
            throw new BadRequestException(
                'Invalid session, please log in again.',
            );
        else return session;
    }
}
