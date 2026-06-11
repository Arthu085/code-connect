import { ApiProperty } from '@nestjs/swagger';
import { AuthorDto } from './author.dto';

export class CommentDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ example: 'Ótimo post, me ajudou bastante!' })
  text: string;

  @ApiProperty({ type: AuthorDto })
  author: AuthorDto;

  @ApiProperty()
  createdAt: Date;
}
