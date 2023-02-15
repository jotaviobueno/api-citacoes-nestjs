import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Session, SessionDocument } from '../../../../models/session.model';
import { CreateSessionDto } from '../../dto/create-session.dto';
import { SessionRepository } from '../session.repository';

@Injectable()
export class ISessionRepository implements SessionRepository {
    constructor(
        @InjectModel(Session.name)
        private readonly sessionModel: Model<SessionDocument>,
    ) {}

    create(
        user_id: Types.ObjectId,
        createSessionDto: CreateSessionDto,
        addressIp: string,
        userAgent: string,
    ): Promise<Session> {
        const session = new this.sessionModel({
            user_id,
            ...createSessionDto,
            address_ip: addressIp,
            user_agent: userAgent,
        });

        return session.save();
    }

    async findBySessionId(session_id: string): Promise<Session> {
        return await this.sessionModel.findOne({
            session_id,
            disconnected_in: null,
        });
    }

    async disconnectById(_id: Types.ObjectId) {
        return await this.sessionModel.updateOne(
            { _id, disconnected_in: null },
            {
                disconnected_in: new Date(),
                updated_at: new Date(),
            },
        );
    }

    async disconnectBySessionId(session_id: string) {
        return await this.sessionModel.updateOne(
            {
                session_id,
                disconnected_in: null,
            },
            {
                disconnected_in: new Date(),
                updated_at: new Date(),
            },
        );
    }

    async disconnectAllSessionByUserId(user_id: Types.ObjectId) {
        return await this.sessionModel.updateMany(
            { user_id, disconnected_in: null },
            { disconnected_in: new Date(), updated_at: new Date() },
        );
    }
}
