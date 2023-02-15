import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
    _id: Types.ObjectId;
    @Prop({ type: String, required: true, minlength: 2, maxlength: 50 })
    first_name: string;
    @Prop({ type: String, required: true, minlength: 2, maxlength: 50 })
    last_name: string;
    @Prop({
        type: String,
        unique: true,
        required: true,
        minlength: 3,
        maxlength: 20,
    })
    username: string;
    @Prop({ type: String, unique: true, required: true })
    email: string;
    @Prop({ type: Date, default: null })
    email_verified_at: Date | null;
    @Prop({ type: Date, required: true })
    birth_date: Date;
    @Prop({ type: String, required: true })
    password: string;
    @Prop({ type: String, default: null })
    avatar_url: string;
    @Prop({ type: String, required: true })
    genre: string;
    @Prop({ type: Boolean, default: true })
    active: boolean;
    @Prop({ type: Date, default: new Date() })
    created_at: Date;
    @Prop({ type: Date, default: new Date() })
    updated_at: Date;
    @Prop({ type: Date, default: null })
    deleted_at: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
