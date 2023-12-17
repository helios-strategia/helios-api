import { Controller, Inject, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '@/api/auth/auth.service';
import { LocalAuthGuard } from '@/api/auth/local-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('/v1/auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
