import { Controller, Post, Body, Headers } from '@nestjs/common';
import { CreateTokenToDeleteAccountDto } from './dto/create-token-to-delete-account.dto';
import { CreateTokenToChangePasswordDto } from './dto/create-token-to-change-password.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('/generate-token/delete-account')
    createTokenToDeleteAccount(
        @Headers('session_id') session_id: string,
        @Body() createTokenToDeleteAccountDto: CreateTokenToDeleteAccountDto,
    ) {
        return this.authService.createTokenToDeleteAccount(
            session_id,
            createTokenToDeleteAccountDto,
        );
    }

    @Post('/generate-token/change-password')
    createTokenToChangePassword(
        @Body() createTokenToChangePasswordDto: CreateTokenToChangePasswordDto,
    ) {
        return this.authService.createTokenToChangePassword(
            createTokenToChangePasswordDto,
        );
    }

    @Post('/generate-token/change-email')
    createTokenToChangeEmail(@Headers('session_id') session_id: string) {
        return this.authService.createTokenToChangeEmail(session_id);
    }

    @Post('/generate-token/verify-account')
    createTokenToVerifyAccount(@Headers('session_id') session_id: string) {
        return this.authService.createTokenToVerifyAccount(session_id);
    }
}
