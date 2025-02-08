import { ApiOkResponse, ApiProperty, getSchemaPath } from '@nestjs/swagger';
// import { applyDecorators, Type } from '@nestjs/common';
import { UserEntity } from '../../database/entities/user.entity';

export class PaginatedResDto {
  @ApiProperty({ type: 'number' })
  page: number;

  @ApiProperty({ type: 'number' })
  pages: number;

  @ApiProperty({ type: 'number' })
  limit: number;

  @ApiProperty({ type: 'number' })
  total: number;

  entities: Partial<UserEntity>[];
}

// export const ApiPaginatedResponse = <TModel extends Type<any>>(
//   property: string,
//   model: TModel,
// ) => {
//   return applyDecorators(
//     ApiOkResponse({
//       schema: {
//         properties: {
//           data: {
//             allOf: [
//               { $ref: getSchemaPath(PaginatedDto) },
//               {
//                 properties: {
//                   [`${property}`]: {
//                     type: 'array',
//                     items: { $ref: getSchemaPath(model) },
//                   },
//                 },
//               },
//             ],
//           },
//         },
//       },
//     }),
//   );
// };
