export type AuthorSummary = {
  id: string;
  name: string;
};

export type CommentSummary = {
  id: string;
  text: string;
  author: AuthorSummary;
  createdAt: Date;
};

export type PostSummary = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverUrl: string | null;
  tags: string[];
  author: AuthorSummary;
  commentsCount: number;
  likesCount: number;
  likedByMe: boolean;
  createdAt: Date;
};

export type PostDetail = PostSummary & {
  content: string;
  comments: CommentSummary[];
};
