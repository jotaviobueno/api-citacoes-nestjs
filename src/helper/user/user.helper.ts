import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { User } from 'src/models/user.model';
import { UserRepository } from 'src/modules/user/repositories/user.repository';

@Injectable()
export class UserHelper {
    constructor(private readonly userRepository: UserRepository) {}

    async getUser(user_id: Types.ObjectId): Promise<User> {
        return await this.userRepository.findById(user_id);
    }
}
