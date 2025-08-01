import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { authMiddleware } from './middleware/auth.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { VideoModule } from './video/video.module';


@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('DB_URI'),
    }),
    inject: [ConfigService],
  }), UserModule, AuthModule, EmployeeModule, JwtModule, VideoModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, JwtService],
  exports: [JwtService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(authMiddleware)
      .forRoutes({ path: 'user', method: RequestMethod.GET });
  }
}