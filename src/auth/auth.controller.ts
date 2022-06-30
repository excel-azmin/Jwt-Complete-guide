import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { Tokens } from './types';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('signup')
    async signup(@Body() dto: AuthDto): Promise<Tokens>{
        return await this.authService.signup(dto);

    }

    @Post('signin')
    async signin(@Body() dto: AuthDto): Promise<Tokens>{
       return await this.authService.signin(dto);
    }
    @Post('logout')
    logout(){
        this.authService.logout();
    }

    @Post('refresh-token')
    refreshToken(){
        this.authService.refreshToken();
    }
}
