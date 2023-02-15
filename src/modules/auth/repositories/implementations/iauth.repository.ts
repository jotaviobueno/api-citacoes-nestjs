import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Auth, AuthDocument } from 'src/models/auth.model';
import { AuthRepository } from '../auth.repository';

@Injectable()
export class IAuthRepository implements AuthRepository {
    constructor(
        @InjectModel(Auth.name)
        private readonly authModel: Model<AuthDocument>,
    ) {}

    async create(
        user_id: Types.ObjectId,
        generate_token_for: string,
    ): Promise<Auth> {
        return await this.authModel.create({ user_id, generate_token_for });
    }

    async findByToken(token: string): Promise<Auth> {
        return await this.authModel.findOne({ token, status: 'generated' });
    }

    async findTokenByUserId(
        user_id: Types.ObjectId,
        generate_token_for: string,
    ): Promise<Auth> {
        return await this.authModel.findOne({
            user_id,
            status: 'generated',
            generate_token_for,
        });
    }

    async updateToken(
        _id: Types.ObjectId,
        generate_token_for: string,
        status: string,
    ) {
        return await this.authModel.updateOne(
            { _id, generate_token_for },
            {
                status,
                updated_at: new Date(),
            },
        );
    }
}
