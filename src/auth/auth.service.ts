import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(payload: { id: string, email: string }): Promise<string> {
    return this.jwtService.sign(payload); 
  }
}