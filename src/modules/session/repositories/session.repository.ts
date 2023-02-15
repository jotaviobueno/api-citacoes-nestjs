import { CreateSessionDto } from '../dto/create-session.dto';
import { Session } from '../../../models/session.model';
import { Types } from 'mongoose';

export abstract class SessionRepository {
    abstract create(
        user_id: Types.ObjectId,
        createSessionDto: CreateSessionDto,
        addressIp: string,
        userAgent: string,
    ): Promise<Session>;

    abstract findBySessionId(session_id: string): Promise<Session>;
    abstract disconnectById(_id: Types.ObjectId);
    abstract disconnectBySessionId(session_id: string);
    abstract disconnectAllSessionByUserId(user_id: Types.ObjectId);
}
