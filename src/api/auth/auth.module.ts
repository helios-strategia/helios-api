import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@/api/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from '@/api/auth/auth.controller';
import { LocalStrategy } from '@/api/auth/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@/api/auth/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '@/api/auth/jwt-auth.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
