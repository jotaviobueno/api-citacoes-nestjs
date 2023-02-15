import {
    UnauthorizedException,
    Injectable,
    BadRequestException,
} from '@nestjs/common';
import { AuthRepository } from './repositories/auth.repository';
import { authTransformer, newAuth } from './transformer/authTransformer';
import * as bcrypt from 'bcrypt';
import { SessionHelper } from 'src/helper/session/session.Helper';
import { UserHelper } from 'src/helper/user/user.helper';
import { Types } from 'mongoose';
import { Auth } from 'src/models/auth.model';
import { UserRepository } from '../user/repositories/user.repository';
import { CreateTokenToDeleteAccountDto } from './dto/create-token-to-delete-account.dto';
import { CreateTokenToChangePasswordDto } from './dto/create-token-to-change-password.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly authRepository: AuthRepository,
        private readonly sessionHelper: SessionHelper,
        private readonly userRepository: UserRepository,
        private readonly userHelper: UserHelper,
    ) {}

    async createTokenToDeleteAccount(
        session_id: string,
        createTokenToDeleteAcccountDto: CreateTokenToDeleteAccountDto,
    ): Promise<newAuth> {
        const session = await this.sessionHelper.handleSession(session_id);
        const user = await this.userHelper.getUser(session.user_id);
        const comparePassword = await bcrypt.compare(
            createTokenToDeleteAcccountDto.password,
            user.password,
        );

        if (!comparePassword) throw new UnauthorizedException('not auhorized.');

        const auth = await this.handleTokenCreation(user._id, 'DELETE_ACCOUNT');

        return authTransformer(auth);
    }

    async createTokenToChangePassword(
        createTokenToChangePasswordDto: CreateTokenToChangePasswordDto,
    ): Promise<newAuth> {
        const user = await this.userRepository.findByEmail(
            createTokenToChangePasswordDto.email,
        );

        if (!user)
            throw new UnauthorizedException(
                'it will not be possible to proceed.',
            );

        const auth = await this.handleTokenCreation(
            user._id,
            'CHANGE_PASSWORD',
        );

        return authTransformer(auth);
    }

    async createTokenToChangeEmail(session_id: string): Promise<newAuth> {
        const session = await this.sessionHelper.handleSession(session_id);
        const user = await this.userHelper.getUser(session.user_id);

        const auth = await this.handleTokenCreation(user._id, 'CHANGE_EMAIL');

        return authTransformer(auth);
    }

    async createTokenToVerifyAccount(session_id: string): Promise<newAuth> {
        const session = await this.sessionHelper.handleSession(session_id);
        const user = await this.userHelper.getUser(session.user_id);

        if (user.email_verified_at)
            throw new BadRequestException('your account is already verified.');

        const auth = await this.handleTokenCreation(user._id, 'VERIFY_ACCOUNT');

        return authTransformer(auth);
    }

    private async handleTokenCreation(
        user_id: Types.ObjectId,
        generatedTokenFor: string,
    ): Promise<Auth> {
        const CheckUserToken = await this.authRepository.findTokenByUserId(
            user_id,
            generatedTokenFor,
        );

        if (CheckUserToken) {
            await this.authRepository.updateToken(
                CheckUserToken._id,
                generatedTokenFor,
                'discarted',
            );
        }

        return await this.authRepository.create(user_id, generatedTokenFor);
    }
}
