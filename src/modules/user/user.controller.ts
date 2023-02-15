import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Headers,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePasswordWithTokenDto } from './dto/update-password-with-token.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get(':username')
    findOne(@Param('username') username: string) {
        return this.userService.findOne(username);
    }

    @Patch()
    update(
        @Headers('session_id') session_id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return this.userService.update(session_id, updateUserDto);
    }

    @Patch('/update/password')
    updatePasswordWithToken(
        @Headers('token') token: string,
        @Body() updatePasswordWithTokenDto: UpdatePasswordWithTokenDto,
    ) {
        return this.userService.updatePasswordWithToken(
            token,
            updatePasswordWithTokenDto,
        );
    }

    @Patch('/verify-account')
    verifyAccount(@Headers('token') token: string) {
        return this.userService.verifyAccount(token);
    }

    @Delete()
    delete(@Headers('token') token: string) {
        return this.userService.delete(token);
    }
}
