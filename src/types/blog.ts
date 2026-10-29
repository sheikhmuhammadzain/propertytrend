export type BlogStatus = 'draft' | 'published'

export interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string | null
  content?: string // present on single-post responses
  cover_image: string | null
  author: string | null
  tags: string[]
  status: BlogStatus
  meta_title: string | null
  meta_description: string | null
  reading_minutes: number
  created_at: string
  updated_at: string
  published_at: string | null
}

export interface BlogListResponse {
  posts: BlogPost[]
  total: number
  limit: number
  offset: number
}

export interface BlogInput {
  title: string
  content: string
  excerpt?: string
  slug?: string
  cover_image?: string
  author?: string
  tags?: string[]
  status?: BlogStatus
  meta_title?: string
  meta_description?: string
}
