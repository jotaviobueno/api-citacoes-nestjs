import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/models/user.model';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UserRepository } from '../user.repository';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { UpdateEmailWithTokenDto } from '../../dto/update-email-with-token.dto';

@Injectable()
export class IUserRepository implements UserRepository {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new this.userModel({
            ...createUserDto,
            password: await bcrypt.hash(createUserDto.password, 8),
            genre: createUserDto.genre.toUpperCase(),
            birth_date: new Date(createUserDto.birth_date),
        });

        return user.save();
    }

    async update(_id: Types.ObjectId, updateUserDto: UpdateUserDto) {
        return await this.userModel.updateOne(
            { _id, deleted_at: null },
            {
                ...updateUserDto,
                updated_at: new Date(),
            },
        );
    }

    async updateEmailWithToken(
        _id: Types.ObjectId,
        updateEmailWithToken: UpdateEmailWithTokenDto,
    ) {
        return await this.userModel.updateOne(
            { _id, deleted_at: null },
            {
                ...updateEmailWithToken,
                updated_at: new Date(),
            },
        );
    }

    async verifyAccount(_id: Types.ObjectId) {
        return await this.userModel.updateOne(
            { _id, deleted_at: null },
            {
                email_verified_at: new Date(),
                updated_at: new Date(),
            },
        );
    }

    async findByUsername(username: string): Promise<User> {
        return await this.userModel.findOne({
            username,
            deleted_at: null,
        });
    }

    async findById(_id: Types.ObjectId): Promise<User> {
        return await this.userModel.findOne({
            _id,
            deleted_at: null,
        });
    }

    async findByEmail(email: string): Promise<User> {
        return await this.userModel.findOne({
            email,
            deleted_at: null,
        });
    }

    async delete(_id: Types.ObjectId) {
        return await this.userModel.updateOne(
            { _id, deleted_at: null },
            {
                deleted_at: new Date(),
                updated_at: new Date(),
            },
        );
    }
}
