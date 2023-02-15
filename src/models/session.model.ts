import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { randomUUID } from 'node:crypto';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
    _id: Types.ObjectId;
    @Prop({ type: String, default: randomUUID })
    session_id: string;
    @Prop({ type: String, required: true })
    email: string;
    @Prop({ type: Types.ObjectId, ref: 'users', required: true })
    user_id: Types.ObjectId;
    @Prop({ type: String, required: true })
    address_ip: string;
    @Prop({ type: String, required: true })
    user_agent: string;
    @Prop({ type: Date, default: new Date() })
    created_at: Date;
    @Prop({ type: Date, default: new Date() })
    updated_at: Date;
    @Prop({ type: Date, default: null })
    disconnected_in: Date | null;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
