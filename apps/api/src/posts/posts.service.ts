import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { CommentSummary, PostDetail, PostSummary } from './entities/post.entity';
import { slugify } from './utils/slugify';

const authorSelect = { select: { id: true, name: true } } as const;

// Placeholder UUID used to filter the `likes` relation when there's no
// authenticated user, so `likedByMe` is always `false` without branching types.
const NIL_USER_ID = '00000000-0000-0000-0000-000000000000';

const summaryInclude = (userId?: string) =>
  ({
    author: authorSelect,
    _count: { select: { comments: true, likes: true } },
    likes: { where: { userId: userId ?? NIL_USER_ID }, select: { id: true } },
  }) satisfies Prisma.PostInclude;

type PostWithRelations = Prisma.PostGetPayload<{
  include: ReturnType<typeof summaryInclude>;
}>;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: FindPostsQueryDto & { userId?: string },
  ): Promise<PostSummary[]> {
    const { search, tag, sort = 'recent', userId } = query;

    let rankedIds: string[] | undefined;
    if (search) {
      const tagFilter = tag
        ? Prisma.sql`AND ${tag} = ANY(tags)`
        : Prisma.empty;
      const rows = await this.prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
        SELECT id FROM posts
        WHERE search_vector @@ websearch_to_tsquery('portuguese', ${search})
        ${tagFilter}
        ORDER BY ts_rank(search_vector, websearch_to_tsquery('portuguese', ${search})) DESC
      `);
      rankedIds = rows.map((row) => row.id);
      if (rankedIds.length === 0) return [];
    }

    const posts = await this.prisma.post.findMany({
      where: {
        ...(rankedIds ? { id: { in: rankedIds } } : {}),
        ...(tag && !rankedIds ? { tags: { has: tag } } : {}),
      },
      include: summaryInclude(userId),
      orderBy: rankedIds
        ? undefined
        : sort === 'popular'
          ? { likes: { _count: 'desc' } }
          : { createdAt: 'desc' },
    });

    const summaries = posts.map((post) => this.toSummary(post, userId));

    if (rankedIds) {
      const order = new Map(rankedIds.map((id, index) => [id, index]));
      summaries.sort((a, b) => order.get(a.id)! - order.get(b.id)!);
    }

    return summaries;
  }

  async findBySlug(slug: string, userId?: string): Promise<PostDetail> {
    const post = await this.prisma.post.findUnique({
      where: { slug },
      include: {
        ...summaryInclude(userId),
        comments: {
          include: { author: authorSelect },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return {
      ...this.toSummary(post, userId),
      content: post.content,
      comments: post.comments.map((comment) => this.toCommentSummary(comment)),
    };
  }

  async create(userId: string, dto: CreatePostDto): Promise<PostDetail> {
    const slug = await this.generateUniqueSlug(dto.title);

    const post = await this.prisma.post.create({
      data: {
        title: dto.title,
        description: dto.description,
        content: dto.content,
        coverUrl: dto.coverUrl,
        tags: dto.tags ?? [],
        slug,
        authorId: userId,
      },
      include: {
        ...summaryInclude(userId),
        comments: {
          include: { author: authorSelect },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return {
      ...this.toSummary(post, userId),
      content: post.content,
      comments: [],
    };
  }

  async like(postId: string, userId: string): Promise<void> {
    await this.ensurePostExists(postId);

    await this.prisma.like.upsert({
      where: { postId_userId: { postId, userId } },
      create: { postId, userId },
      update: {},
    });
  }

  async unlike(postId: string, userId: string): Promise<void> {
    await this.ensurePostExists(postId);

    await this.prisma.like.deleteMany({ where: { postId, userId } });
  }

  async addComment(
    postId: string,
    userId: string,
    dto: CreateCommentDto,
  ): Promise<CommentSummary> {
    await this.ensurePostExists(postId);

    const comment = await this.prisma.comment.create({
      data: { text: dto.text, postId, authorId: userId },
      include: { author: authorSelect },
    });

    return this.toCommentSummary(comment);
  }

  private async ensurePostExists(postId: string): Promise<void> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    const base = slugify(title) || 'post';

    let slug = base;
    let suffix = 1;
    while (
      await this.prisma.post.findUnique({
        where: { slug },
        select: { id: true },
      })
    ) {
      suffix += 1;
      slug = `${base}-${suffix}`;
    }

    return slug;
  }

  private toSummary(post: PostWithRelations, userId?: string): PostSummary {
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      description: post.description,
      coverUrl: post.coverUrl,
      tags: post.tags,
      author: post.author,
      commentsCount: post._count.comments,
      likesCount: post._count.likes,
      likedByMe: post.likes.length > 0,
      createdAt: post.createdAt,
    };
  }

  private toCommentSummary(
    comment: Prisma.CommentGetPayload<{
      include: { author: typeof authorSelect };
    }>,
  ): CommentSummary {
    return {
      id: comment.id,
      text: comment.text,
      author: comment.author,
      createdAt: comment.createdAt,
    };
  }
}
