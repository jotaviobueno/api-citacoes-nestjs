import {
    Injectable,
    UnauthorizedException,
    UnprocessableEntityException,
} from '@nestjs/common';
import { Auth } from 'src/models/auth.model';
import { AuthRepository } from 'src/modules/auth/repositories/auth.repository';

@Injectable()
export class AuthHelper {
    constructor(private readonly authRepository: AuthRepository) {}

    async handleAuth(token: string, generatedFor: string): Promise<Auth> {
        const _token = await this.authRepository.findByToken(token);

        if (!_token) throw new UnprocessableEntityException('invalid token.');

        if (new Date() >= _token.expires_at) {
            await this.authRepository.updateToken(
                _token._id,
                _token.generate_token_for,
                'expirated',
            );

            throw new UnauthorizedException('token has expired');
        }

        if (_token.generate_token_for != generatedFor)
            throw new UnprocessableEntityException(
                'The informed token is invalid.',
            );

        return _token;
    }
}
