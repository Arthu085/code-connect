import { api } from './api'

export type Author = {
  id: string
  name: string
}

export type Comment = {
  id: string
  text: string
  author: Author
  createdAt: string
}

export type PostSummary = {
  id: string
  slug: string
  title: string
  description: string
  coverUrl: string | null
  tags: string[]
  author: Author
  commentsCount: number
  likesCount: number
  likedByMe: boolean
  createdAt: string
}

export type PostDetail = PostSummary & {
  content: string
  comments: Comment[]
}

export type PostsSort = 'recent' | 'popular'

export type GetPostsParams = {
  search?: string
  tag?: string
  sort?: PostsSort
}

export type CreatePostData = {
  title: string
  description: string
  content: string
  coverUrl?: string
  tags?: string[]
}

export async function getPosts(params: GetPostsParams = {}): Promise<PostSummary[]> {
  const response = await api.get<PostSummary[]>('/posts', { params })
  return response.data
}

export async function getPost(slug: string): Promise<PostDetail> {
  const response = await api.get<PostDetail>(`/posts/${slug}`)
  return response.data
}

export async function createPost(data: CreatePostData): Promise<PostDetail> {
  const response = await api.post<PostDetail>('/posts', data)
  return response.data
}

export async function likePost(id: string): Promise<void> {
  await api.post(`/posts/${id}/likes`)
}

export async function unlikePost(id: string): Promise<void> {
  await api.delete(`/posts/${id}/likes`)
}

export async function addComment(id: string, text: string): Promise<Comment> {
  const response = await api.post<Comment>(`/posts/${id}/comments`, { text })
  return response.data
}
