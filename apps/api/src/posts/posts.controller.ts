import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommentDto } from './dto/comment.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { PostDetailDto } from './dto/post-detail.dto';
import { PostSummaryDto } from './dto/post-summary.dto';
import { PostsService } from './posts.service';

type AuthenticatedRequest = { user: { userId: string; email: string } };
type OptionalAuthRequest = { user?: { userId: string; email: string } };

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOkResponse({ type: [PostSummaryDto] })
  findAll(
    @Query() query: FindPostsQueryDto,
    @Request() req: OptionalAuthRequest,
  ): Promise<PostSummaryDto[]> {
    return this.postsService.findAll({ ...query, userId: req.user?.userId });
  }

  @Get(':slug')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOkResponse({ type: PostDetailDto })
  @ApiNotFoundResponse({ description: 'Post not found' })
  findOne(
    @Param('slug') slug: string,
    @Request() req: OptionalAuthRequest,
  ): Promise<PostDetailDto> {
    return this.postsService.findBySlug(slug, req.user?.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: PostDetailDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  create(
    @Body() dto: CreatePostDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<PostDetailDto> {
    return this.postsService.create(req.user.userId, dto);
  }

  @Post(':id/likes')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Post liked' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  like(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.postsService.like(id, req.user.userId);
  }

  @Delete(':id/likes')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiNoContentResponse({ description: 'Post unliked' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  unlike(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.postsService.unlike(id, req.user.userId);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CommentDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  addComment(
    @Param('id') id: string,
    @Body() dto: CreateCommentDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<CommentDto> {
    return this.postsService.addComment(id, req.user.userId, dto);
  }
}
