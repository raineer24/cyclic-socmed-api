import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // eslint-disable-next-line @typescript-eslint/ban-types
  getHello(): Object {
    return { title: 'Hello Youtube!' };
  }
}
