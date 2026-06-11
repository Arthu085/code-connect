import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { PostsService } from './posts.service';

type FakeUser = { id: string; name: string };
type FakePost = {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  coverUrl: string | null;
  tags: string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
};
type FakeLike = { id: string; postId: string; userId: string; createdAt: Date };
type FakeComment = {
  id: string;
  text: string;
  postId: string;
  authorId: string;
  createdAt: Date;
};

function createFakePrisma() {
  const users: FakeUser[] = [
    { id: randomUUID(), name: 'Ada Lovelace' },
    { id: randomUUID(), name: 'Alan Turing' },
  ];
  const posts: FakePost[] = [];
  const likes: FakeLike[] = [];
  const comments: FakeComment[] = [];

  const findAuthor = (authorId: string) => {
    const author = users.find((u) => u.id === authorId)!;
    return { id: author.id, name: author.name };
  };

  const decorate = (post: FakePost, userId?: string) => ({
    ...post,
    author: findAuthor(post.authorId),
    _count: {
      comments: comments.filter((c) => c.postId === post.id).length,
      likes: likes.filter((l) => l.postId === post.id).length,
    },
    likes: likes
      .filter((l) => l.postId === post.id && l.userId === (userId ?? '00000000-0000-0000-0000-000000000000'))
      .map((l) => ({ id: l.id })),
  });

  const prisma = {
    $queryRaw: jest.fn((sql: Prisma.Sql) => {
      const text = sql.strings.join('');
      const search = String(sql.values[0]).toLowerCase();
      const hasTagFilter = text.includes('ANY(tags)');
      const tag = hasTagFilter ? (sql.values[1] as string) : undefined;

      const matches = posts.filter((p) => {
        const haystack = `${p.title} ${p.description} ${p.content}`.toLowerCase();
        const searchMatch = haystack.includes(search);
        const tagMatch = !tag || p.tags.includes(tag);
        return searchMatch && tagMatch;
      });

      return Promise.resolve(matches.map((p) => ({ id: p.id })));
    }),
    post: {
      findMany: jest.fn(
        ({
          where,
          include,
          orderBy,
        }: {
          where?: { id?: { in: string[] }; tags?: { has: string } };
          include: { likes: { where: { userId: string } } };
          orderBy?:
            | { createdAt: 'desc' }
            | { likes: { _count: 'desc' } };
        }) => {
          let result = [...posts];

          if (where?.id) {
            result = result.filter((p) => where.id!.in.includes(p.id));
          }
          if (where?.tags) {
            result = result.filter((p) => p.tags.includes(where.tags!.has));
          }

          if (orderBy && 'likes' in orderBy) {
            result = result.sort(
              (a, b) =>
                likes.filter((l) => l.postId === b.id).length -
                likes.filter((l) => l.postId === a.id).length,
            );
          } else if (orderBy && 'createdAt' in orderBy) {
            result = result.sort(
              (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
            );
          }

          return Promise.resolve(
            result.map((p) => decorate(p, include.likes.where.userId)),
          );
        },
      ),
      findUnique: jest.fn(
        ({
          where,
          select,
          include,
        }: {
          where: { id?: string; slug?: string };
          select?: { id: true };
          include?: { likes: { where: { userId: string } }; comments?: unknown };
        }) => {
          const post = where.slug
            ? posts.find((p) => p.slug === where.slug)
            : posts.find((p) => p.id === where.id);

          if (!post) return Promise.resolve(null);
          if (select) return Promise.resolve({ id: post.id });

          const decorated = decorate(post, include!.likes.where.userId);
          if (include?.comments) {
            return Promise.resolve({
              ...decorated,
              comments: comments
                .filter((c) => c.postId === post.id)
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                .map((c) => ({ ...c, author: findAuthor(c.authorId) })),
            });
          }
          return Promise.resolve(decorated);
        },
      ),
      create: jest.fn(
        ({
          data,
          include,
        }: {
          data: Omit<FakePost, 'id' | 'createdAt' | 'updatedAt'>;
          include: { likes: { where: { userId: string } } };
        }) => {
          const post: FakePost = {
            id: randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data,
          };
          posts.push(post);
          return Promise.resolve({
            ...decorate(post, include.likes.where.userId),
            comments: [],
          });
        },
      ),
    },
    like: {
      upsert: jest.fn(
        ({
          where,
          create,
        }: {
          where: { postId_userId: { postId: string; userId: string } };
          create: { postId: string; userId: string };
        }) => {
          const existing = likes.find(
            (l) =>
              l.postId === where.postId_userId.postId &&
              l.userId === where.postId_userId.userId,
          );
          if (existing) return Promise.resolve(existing);

          const like: FakeLike = {
            id: randomUUID(),
            postId: create.postId,
            userId: create.userId,
            createdAt: new Date(),
          };
          likes.push(like);
          return Promise.resolve(like);
        },
      ),
      deleteMany: jest.fn(
        ({ where }: { where: { postId: string; userId: string } }) => {
          const before = likes.length;
          for (let i = likes.length - 1; i >= 0; i -= 1) {
            if (likes[i].postId === where.postId && likes[i].userId === where.userId) {
              likes.splice(i, 1);
            }
          }
          return Promise.resolve({ count: before - likes.length });
        },
      ),
    },
    comment: {
      create: jest.fn(
        ({ data }: { data: Omit<FakeComment, 'id' | 'createdAt'> }) => {
          const comment: FakeComment = {
            id: randomUUID(),
            createdAt: new Date(),
            ...data,
          };
          comments.push(comment);
          return Promise.resolve({
            ...comment,
            author: findAuthor(comment.authorId),
          });
        },
      ),
    },
  } as unknown as PrismaService;

  return { prisma, users, posts, likes, comments };
}

function makePost(overrides: Partial<FakePost> & { authorId: string }): FakePost {
  return {
    id: randomUUID(),
    slug: 'post-slug',
    title: 'Post title',
    description: 'Post description',
    content: 'Post content',
    coverUrl: null,
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('PostsService', () => {
  describe('findAll', () => {
    it('returns posts ordered by most recent by default', async () => {
      const { prisma, posts, users } = createFakePrisma();
      posts.push(
        makePost({
          slug: 'older',
          title: 'Older post',
          authorId: users[0].id,
          createdAt: new Date('2024-01-01'),
        }),
        makePost({
          slug: 'newer',
          title: 'Newer post',
          authorId: users[0].id,
          createdAt: new Date('2024-06-01'),
        }),
      );
      const service = new PostsService(prisma);

      const result = await service.findAll({});

      expect(result.map((p) => p.slug)).toEqual(['newer', 'older']);
      expect(result[0].author.name).toBe('Ada Lovelace');
      expect(result[0].likedByMe).toBe(false);
    });

    it('filters by tag', async () => {
      const { prisma, posts, users } = createFakePrisma();
      posts.push(
        makePost({ slug: 'react-post', tags: ['React'], authorId: users[0].id }),
        makePost({ slug: 'vue-post', tags: ['Vue'], authorId: users[0].id }),
      );
      const service = new PostsService(prisma);

      const result = await service.findAll({ tag: 'React' });

      expect(result.map((p) => p.slug)).toEqual(['react-post']);
    });

    it('orders by likes count when sort is popular', async () => {
      const { prisma, posts, users, likes } = createFakePrisma();
      const lessLiked = makePost({ slug: 'less-liked', authorId: users[0].id });
      const mostLiked = makePost({ slug: 'most-liked', authorId: users[0].id });
      posts.push(lessLiked, mostLiked);
      likes.push({
        id: randomUUID(),
        postId: mostLiked.id,
        userId: users[1].id,
        createdAt: new Date(),
      });
      const service = new PostsService(prisma);

      const result = await service.findAll({ sort: 'popular' });

      expect(result.map((p) => p.slug)).toEqual(['most-liked', 'less-liked']);
    });

    it('returns full-text search results ranked by relevance', async () => {
      const { prisma, posts, users } = createFakePrisma();
      posts.push(
        makePost({
          slug: 'about-react',
          title: 'Aprendendo React',
          description: 'Hooks no React',
          authorId: users[0].id,
        }),
        makePost({
          slug: 'about-vue',
          title: 'Aprendendo Vue',
          description: 'Composition API',
          authorId: users[0].id,
        }),
      );
      const service = new PostsService(prisma);

      const result = await service.findAll({ search: 'react' });

      expect(result.map((p) => p.slug)).toEqual(['about-react']);
    });

    it('marks likedByMe when the user already liked the post', async () => {
      const { prisma, posts, users, likes } = createFakePrisma();
      const post = makePost({ slug: 'liked-post', authorId: users[0].id });
      posts.push(post);
      likes.push({
        id: randomUUID(),
        postId: post.id,
        userId: users[1].id,
        createdAt: new Date(),
      });
      const service = new PostsService(prisma);

      const result = await service.findAll({ userId: users[1].id });

      expect(result[0].likedByMe).toBe(true);
      expect(result[0].likesCount).toBe(1);
    });
  });

  describe('findBySlug', () => {
    it('returns the post with its comments', async () => {
      const { prisma, posts, users, comments } = createFakePrisma();
      const post = makePost({ slug: 'with-comments', authorId: users[0].id });
      posts.push(post);
      comments.push({
        id: randomUUID(),
        text: 'Great post!',
        postId: post.id,
        authorId: users[1].id,
        createdAt: new Date(),
      });
      const service = new PostsService(prisma);

      const result = await service.findBySlug('with-comments');

      expect(result.title).toBe(post.title);
      expect(result.comments).toHaveLength(1);
      expect(result.comments[0].text).toBe('Great post!');
      expect(result.comments[0].author.name).toBe('Alan Turing');
    });

    it('throws NotFoundException for an unknown slug', async () => {
      const { prisma } = createFakePrisma();
      const service = new PostsService(prisma);

      await expect(service.findBySlug('unknown')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('creates a post and generates a slug from the title', async () => {
      const { prisma, users } = createFakePrisma();
      const service = new PostsService(prisma);

      const result = await service.create(users[0].id, {
        title: 'Meu Primeiro Post!',
        description: 'Descrição',
        content: 'Conteúdo',
      });

      expect(result.slug).toBe('meu-primeiro-post');
      expect(result.tags).toEqual([]);
      expect(result.comments).toEqual([]);
      expect(result.author.id).toBe(users[0].id);
    });

    it('appends a numeric suffix when the slug already exists', async () => {
      const { prisma, users } = createFakePrisma();
      const service = new PostsService(prisma);

      await service.create(users[0].id, {
        title: 'Post Repetido',
        description: 'Descrição',
        content: 'Conteúdo',
      });
      const second = await service.create(users[0].id, {
        title: 'Post Repetido',
        description: 'Outra descrição',
        content: 'Outro conteúdo',
      });

      expect(second.slug).toBe('post-repetido-2');
    });
  });

  describe('like / unlike', () => {
    it('is idempotent when liking the same post twice', async () => {
      const { prisma, posts, users } = createFakePrisma();
      const post = makePost({ slug: 'likeable', authorId: users[0].id });
      posts.push(post);
      const service = new PostsService(prisma);

      await service.like(post.id, users[1].id);
      await service.like(post.id, users[1].id);

      const result = await service.findAll({ userId: users[1].id });
      expect(result[0].likesCount).toBe(1);
      expect(result[0].likedByMe).toBe(true);
    });

    it('removes the like on unlike', async () => {
      const { prisma, posts, users } = createFakePrisma();
      const post = makePost({ slug: 'unlikeable', authorId: users[0].id });
      posts.push(post);
      const service = new PostsService(prisma);

      await service.like(post.id, users[1].id);
      await service.unlike(post.id, users[1].id);

      const result = await service.findAll({ userId: users[1].id });
      expect(result[0].likesCount).toBe(0);
      expect(result[0].likedByMe).toBe(false);
    });

    it('throws NotFoundException when liking an unknown post', async () => {
      const { prisma, users } = createFakePrisma();
      const service = new PostsService(prisma);

      await expect(service.like(randomUUID(), users[0].id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addComment', () => {
    it('adds a comment to an existing post', async () => {
      const { prisma, posts, users } = createFakePrisma();
      const post = makePost({ slug: 'commentable', authorId: users[0].id });
      posts.push(post);
      const service = new PostsService(prisma);

      const comment = await service.addComment(post.id, users[1].id, {
        text: 'Muito bom!',
      });

      expect(comment.text).toBe('Muito bom!');
      expect(comment.author.name).toBe('Alan Turing');
    });

    it('throws NotFoundException for an unknown post', async () => {
      const { prisma, users } = createFakePrisma();
      const service = new PostsService(prisma);

      await expect(
        service.addComment(randomUUID(), users[0].id, { text: 'oi' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
