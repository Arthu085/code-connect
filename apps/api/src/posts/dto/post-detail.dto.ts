import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from './comment.dto';
import { PostSummaryDto } from './post-summary.dto';

export class PostDetailDto extends PostSummaryDto {
  @ApiProperty({ example: 'Conteúdo completo do post em markdown ou texto.' })
  content: string;

  @ApiProperty({ type: [CommentDto] })
  comments: CommentDto[];
}
