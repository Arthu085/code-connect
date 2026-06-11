import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export type PostsSort = 'recent' | 'popular';

export class FindPostsQueryDto {
  @ApiPropertyOptional({ example: 'react hooks' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'React' })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ enum: ['recent', 'popular'], default: 'recent' })
  @IsOptional()
  @IsIn(['recent', 'popular'])
  sort?: PostsSort;
}
