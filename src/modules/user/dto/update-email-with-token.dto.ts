import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateEmailWithTokenDto extends OmitType(
    PartialType(CreateUserDto),
    [
        'first_name',
        'last_name',
        'username',
        'birth_date',
        'avatar_url',
        'genre',
        'password',
    ],
) {}
