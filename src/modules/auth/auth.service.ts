import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async verifyToken(token: any) {
    // Your token verification logic here
    return { userId: 1 }; // Dummy response
  }
}
