import { CurrentUserInfo } from './user.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (_data, ctx: ExecutionContext): CurrentUserInfo => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
