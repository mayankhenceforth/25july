import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
// import { ControllerModule } from './s/controller/controller.module';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { authMiddleware } from './middleware/auth.middleware';
import { METHODS } from 'http';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), // Loads .env
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      uri: configService.get<string>('DB_URI'),
    }),
    inject: [ConfigService],
  }), UserModule, AuthModule, EmployeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(authMiddleware)
      .forRoutes({path:'user' ,method:RequestMethod.GET});
  }
}