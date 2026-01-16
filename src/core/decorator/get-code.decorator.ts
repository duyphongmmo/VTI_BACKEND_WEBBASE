import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export const PERMISSION_CODE = 'messagePattern';
export const PermissionCode = (...perms: string[]) => {
  return applyDecorators(
    SetMetadata(PERMISSION_CODE, perms),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
};
