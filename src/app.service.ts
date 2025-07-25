import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
    constructor(private readonly configService: ConfigService) {}
  getHello(): string {
  //  const dbUri = this.configService.get<string>('DB_URI');
  //   return `DB URI is: ${dbUri}`;
  return "hello world"
  }
}
