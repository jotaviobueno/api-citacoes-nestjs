import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
    ConflictException,
    NotFoundException,
    UnprocessableEntityException,
} from '@nestjs/common/exceptions';
import { SessionRepository } from '../session/repositories/session.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import { newUser, userTransformer } from './transformer/user.transformer';
import { AuthRepository } from '../auth/repositories/auth.repository';
import { SessionHelper } from 'src/helper/session/session.Helper';
import { AuthHelper } from 'src/helper/auth/auth.helper';
import { UserHelper } from 'src/helper/user/user.helper';
import { UpdatePasswordWithTokenDto } from './dto/update-password-with-token.dto';
import { UpdateEmailWithTokenDto } from './dto/update-email-with-token.dto';

@Injectable()
export class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly sessionRepository: SessionRepository,
        private readonly authRepository: AuthRepository,
        private readonly sessionHelper: SessionHelper,
        private readonly authHelper: AuthHelper,
        private readonly userHelper: UserHelper,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<newUser> {
        try {
            const userStored = await this.userRepository.create(createUserDto);

            return userTransformer(userStored);
        } catch (e) {
            throw new BadRequestException(
                'email or username already existing.',
            );
        }
    }

    async findOne(username: string) {
        const user = await this.userRepository.findByUsername(username);

        if (!user) throw new NotFoundException('user not found.');

        return userTransformer(user);
    }

    async update(sessionId: string, updateUserDto: UpdateUserDto) {
        const isEmpty = (obj: any) => Object.keys(obj).length === 0;

        if (isEmpty(updateUserDto))
            throw new BadRequestException('You sent an empty request.');

        const session = await this.sessionHelper.handleSession(sessionId);

        const user = await this.userHelper.getUser(session.user_id);

        if (
            updateUserDto.first_name &&
            user.first_name === updateUserDto.first_name
        )
            throw new ConflictException(
                'The sent first name is identical to what is being reported in your account.',
            );

        if (
            updateUserDto.last_name &&
            user.last_name === updateUserDto.last_name
        )
            throw new ConflictException(
                'The sent last name is identical to what is being reported in your account.',
            );

        if (updateUserDto.username) {
            if (user.username === updateUserDto.username)
                throw new ConflictException(
                    'The name sent is identical to what is being reported in your account.',
                );

            if (
                await this.userRepository.findByUsername(updateUserDto.username)
            )
                throw new UnprocessableEntityException(
                    'The username already exist.',
                );
        }

        if (updateUserDto.password) {
            if (await bcrypt.compare(updateUserDto.password, user.password))
                throw new ConflictException(
                    'The password provided is equal to your account password.',
                );

            updateUserDto.password = await bcrypt.hash(
                updateUserDto.password,
                8,
            );
        }

        if (updateUserDto.birth_date)
            updateUserDto.birth_date = new Date(updateUserDto.birth_date);

        if (updateUserDto.genre && user.username === updateUserDto.genre)
            throw new ConflictException(
                'The gender sent for alteration is equal to your account gender.',
            );

        const update = await this.userRepository.update(
            user._id,
            updateUserDto,
        );

        if (update.modifiedCount != 1)
            throw new UnprocessableEntityException('try again.');

        if (updateUserDto.password) {
            delete updateUserDto.password;

            await this.sessionRepository.disconnectById(session._id);
        }

        return { ...userTransformer(user), ...updateUserDto };
    }

    async updatePasswordWithToken(
        token: string,
        updatePasswordWithTokenDto: UpdatePasswordWithTokenDto,
    ) {
        const _token = await this.authHelper.handleAuth(
            token,
            'CHANGE_PASSWORD',
        );

        const user = await this.userHelper.getUser(_token.user_id);

        if (
            await bcrypt.compare(
                updatePasswordWithTokenDto.password,
                user.password,
            )
        )
            throw new ConflictException(
                'use a different password than the one on your account.',
            );

        updatePasswordWithTokenDto.password = await bcrypt.hash(
            updatePasswordWithTokenDto.password,
            8,
        );

        const update = await this.userRepository.update(
            user._id,
            updatePasswordWithTokenDto,
        );

        if (update.modifiedCount != 1)
            throw new UnprocessableEntityException('try again.');

        await this.authRepository.updateToken(
            _token._id,
            _token.generate_token_for,
            'used',
        );

        await this.sessionRepository.disconnectAllSessionByUserId(user._id);

        return { success: 'password changed.' };
    }

    async updateEmailWithToken(
        token: string,
        updateEmailWithTokenDto: UpdateEmailWithTokenDto,
    ) {
        const _token = await this.authHelper.handleAuth(token, 'CHANGE_EMAIL');

        const user = await this.userHelper.getUser(_token.user_id);

        if (
            await this.userRepository.findByEmail(updateEmailWithTokenDto.email)
        )
            throw new UnprocessableEntityException('Email already exist.');

        const update = await this.userRepository.updateEmailWithToken(
            user._id,
            updateEmailWithTokenDto,
        );

        if (update.modifiedCount != 1)
            throw new UnprocessableEntityException('try again.');

        await this.authRepository.updateToken(
            _token._id,
            _token.generate_token_for,
            'used',
        );

        await this.sessionRepository.disconnectAllSessionByUserId(user._id);

        return { success: 'email changed.' };
    }

    async verifyAccount(token: string) {
        const _token = await this.authHelper.handleAuth(
            token,
            'VERIFY_ACCOUNT',
        );

        const user = await this.userHelper.getUser(_token.user_id);

        const update = await this.userRepository.verifyAccount(user._id);

        if (update.modifiedCount != 1)
            throw new UnprocessableEntityException('try again.');

        await this.authRepository.updateToken(
            _token._id,
            _token.generate_token_for,
            'used',
        );

        return { success: 'account verified.' };
    }

    async delete(token: string) {
        const _token = await this.authHelper.handleAuth(
            token,
            'DELETE_ACCOUNT',
        );

        const user = await this.userHelper.getUser(_token.user_id);

        const update = await this.userRepository.delete(user._id);

        if (update.modifiedCount != 1)
            throw new UnprocessableEntityException('try again.');

        await this.authRepository.updateToken(
            _token._id,
            _token.generate_token_for,
            'used',
        );

        await this.sessionRepository.disconnectAllSessionByUserId(user._id);

        return { success: 'account deleted.' };
    }
}
