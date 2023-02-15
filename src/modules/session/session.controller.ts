import { Controller, Post, Body, Req, Headers } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Controller('session')
export class SessionController {
    constructor(private readonly sessionService: SessionService) {}

    @Post()
    create(@Req() req, @Body() createSessionDto: CreateSessionDto) {
        const addressIp: string =
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        const userAgent: string = req.headers['user-agent'];

        return this.sessionService.create(
            createSessionDto,
            addressIp,
            userAgent,
        );
    }

    @Post('/disconnect')
    disconnect(@Headers('session_id') session_id: string) {
        return this.sessionService.disconnect(session_id);
    }
}
