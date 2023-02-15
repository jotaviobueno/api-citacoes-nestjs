import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { randomUUID } from 'node:crypto';

export type ArticleDocument = HydratedDocument<Article>;

@Schema()
export class Article {
    _id: Types.ObjectId;
    @Prop({ type: String, default: randomUUID })
    article_id: string;
    @Prop({ type: Types.ObjectId, ref: 'users', required: true })
    user_id: Types.ObjectId;
    @Prop({ type: String, required: true })
    author: string;
    @Prop({ type: String, required: true })
    content: string;
    @Prop({ type: Number, default: 0 })
    total_likes: number;
    @Prop({ type: Date, default: new Date() })
    created_at: Date;
    @Prop({ type: Date, default: new Date() })
    updated_at: Date;
    @Prop({ type: Date, default: null })
    deleted_at: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
