import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class authMiddleware implements NestMiddleware {


    use(req: Request, res: Response, next: NextFunction) {
        // console.log("this is auth middleware")

        next();
    }
}
