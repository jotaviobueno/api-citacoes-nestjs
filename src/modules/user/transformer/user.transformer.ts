import { User } from 'src/models/user.model';

export interface newUser {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    birth_date: Date;
    avatar_url: string | null;
    genre: string;
    active: boolean;
    created_at: Date;
    updated_at: Date;
}

export function userTransformer(userStored: User): newUser {
    return {
        first_name: userStored.first_name,
        last_name: userStored.last_name,
        username: userStored.username,
        email: userStored.email,
        birth_date: userStored.birth_date,
        avatar_url: userStored.avatar_url,
        genre: userStored.genre,
        active: userStored.active,
        created_at: userStored.created_at,
        updated_at: userStored.updated_at,
    };
}
