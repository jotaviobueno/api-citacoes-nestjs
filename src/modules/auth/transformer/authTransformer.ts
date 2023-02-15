import { Auth } from 'src/models/auth.model';

export interface newAuth {
    token: string;
    expires_at: Date;
    status: string;
    generate_token_for: string;
    created_at: Date;
    updated_at: Date;
}

export function authTransformer(authStored: Auth): newAuth {
    return {
        token: authStored.token,
        expires_at: authStored.expires_at,
        status: authStored.status,
        generate_token_for: authStored.generate_token_for,
        created_at: authStored.created_at,
        updated_at: authStored.updated_at,
    };
}
