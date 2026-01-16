import { SetMetadata } from '@nestjs/common';

export const MESSAGE_KEY = 'messageKey';
export const AuthorizeMessage = (msg: string) => SetMetadata(MESSAGE_KEY, msg);
