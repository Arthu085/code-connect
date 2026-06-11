import { ApiProperty } from '@nestjs/swagger';
import { AuthorDto } from './author.dto';

export class PostSummaryDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ example: 'como-usar-hooks-no-react' })
  slug: string;

  @ApiProperty({ example: 'Como usar hooks no React' })
  title: string;

  @ApiProperty({ example: 'Um resumo curto sobre o conteúdo do post.' })
  description: string;

  @ApiProperty({ example: 'https://example.com/cover.png', nullable: true })
  coverUrl: string | null;

  @ApiProperty({ example: ['React', 'Front-end'], type: [String] })
  tags: string[];

  @ApiProperty({ type: AuthorDto })
  author: AuthorDto;

  @ApiProperty({ example: 12 })
  commentsCount: number;

  @ApiProperty({ example: 34 })
  likesCount: number;

  @ApiProperty({ example: false })
  likedByMe: boolean;

  @ApiProperty()
  createdAt: Date;
}
