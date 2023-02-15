import { Types } from 'mongoose';
import { User } from 'src/models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateEmailWithTokenDto } from '../dto/update-email-with-token.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export abstract class UserRepository {
    abstract create(createUserDto: CreateUserDto): Promise<User>;
    abstract update(_id: Types.ObjectId, updateUserDto: UpdateUserDto);
    abstract updateEmailWithToken(
        _id: Types.ObjectId,
        updateEmailWithToken: UpdateEmailWithTokenDto,
    );
    abstract verifyAccount(_id: Types.ObjectId);
    abstract findByUsername(username: string): Promise<User>;
    abstract findByEmail(email: string): Promise<User>;
    abstract findById(_id: Types.ObjectId): Promise<User>;
    abstract delete(_id: Types.ObjectId);
}
