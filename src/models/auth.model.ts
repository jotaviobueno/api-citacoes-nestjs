import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { randomUUID } from 'node:crypto';

export type AuthDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
    _id: Types.ObjectId;
    @Prop({ type: String, default: randomUUID })
    token: string;
    @Prop({ type: Types.ObjectId, ref: 'users', required: true })
    user_id: Types.ObjectId;
    @Prop({
        type: Date,
        default: new Date().setHours(new Date().getHours() + 1),
    })
    expires_at: Date;
    @Prop({ type: String, default: 'generated' })
    status: string;
    @Prop({ type: String, required: true })
    generate_token_for: string;
    @Prop({ type: Date, default: new Date() })
    created_at: Date;
    @Prop({ type: Date, default: new Date() })
    updated_at: Date;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
