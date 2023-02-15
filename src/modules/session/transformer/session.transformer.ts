import { Session } from 'src/models/session.model';

export interface newSession {
    session_id: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export function sessionTransformer(sessionStored: Session): newSession {
    return {
        session_id: sessionStored.session_id,
        email: sessionStored.email,
        created_at: sessionStored.created_at,
        updated_at: sessionStored.updated_at,
    };
}
