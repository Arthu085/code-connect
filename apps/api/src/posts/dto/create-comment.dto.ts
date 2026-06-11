import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ example: 'Ótimo post, me ajudou bastante!' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  text: string;
}
