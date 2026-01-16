import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@components/user/dto/response/user.response.dto';
import { SuccessResponse } from '@utils/success.response.dto';

class Meta {
  @Expose()
  total: number;

  @Expose()
  page: number;
}
export class MetaData {
  @Expose()
  data: UserResponseDto[];

  @Expose()
  meta: Meta;
}

export class GetListUserResponseDto extends SuccessResponse {
  @ApiProperty({
    example: {
      items: [
        {
          id: 6,
          email: 'builam972@gmail.com',
          username: 'minh2',
          fullName: 'qưeqwe',
          companyId: 8,
          code: 'EAUD2',
          userWarehouses: [
            {
              id: 5,
              name: 'company 5',
            },
            {
              id: 6,
              name: 'warehouse 11',
            },
          ],
          userRoleSettings: [
            {
              id: 1,
              name: 'role 1',
            },
          ],
          departmentSettings: [
            {
              id: 1,
              name: 'department 1',
            },
          ],
          factories: [
            {
              id: 7,
              name: 'factory 1',
            },
          ],
        },
        {
          id: 5,
          email: 'builam971@gmail.com',
          username: 'minh1',
          fullName: 'qưeqwe',
          companyId: 8,
          code: 'EAUD1',
          userWarehouses: [
            {
              id: 5,
              name: 'company 5',
            },
            {
              id: 6,
              name: 'warehouse 11',
            },
          ],
          userRoleSettings: [],
          departmentSettings: [],
          factories: [],
        },
      ],
      meta: {
        total: 2,
      },
    },
    description: '',
  })
  @Expose()
  data: MetaData;
}
