import { Types } from 'mongoose';
import { Auth } from 'src/models/auth.model';

export abstract class AuthRepository {
    abstract create(
        user_id: Types.ObjectId,
        generate_token_for: string,
    ): Promise<Auth>;

    abstract findByToken(token: string): Promise<Auth>;
    abstract findTokenByUserId(
        user_id: Types.ObjectId,
        generate_token_for: string,
    ): Promise<Auth>;

    abstract updateToken(
        _id: Types.ObjectId,
        generate_token_for: string,
        status: string,
    );
}
