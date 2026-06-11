import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ example: 'Como usar hooks no React' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title: string;

  @ApiProperty({ example: 'Um resumo curto sobre o conteúdo do post.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(280)
  description: string;

  @ApiProperty({ example: 'Conteúdo completo do post em markdown ou texto.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 'https://example.com/cover.png' })
  @IsOptional()
  @IsUrl()
  coverUrl?: string;

  @ApiPropertyOptional({ example: ['React', 'Front-end'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
