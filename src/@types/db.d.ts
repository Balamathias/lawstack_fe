export interface User {
    id: string,
    username: string,
    email: string,
    first_name: string | null,
    last_name: string | null,
    is_active?: boolean,
    is_staff?: boolean,
    is_superuser?: boolean,
    avatar: string | null,
    phone: string | null,
    created_at: string,
  }
  
  export interface Thumbnail { image?: string | null, images?: string[] | null }
  
  export interface Tag {
    id: string | number,
    name: string,
    created_at?: string,
    updated_at?: string | null,
  }
  
  export interface Like {
    id: string | number
    username: string
  }
  export interface Post {
    id: string,
    title: string,
    content: string,
    created_at: string,
    updated_at: string | null,
    author: User,
    thumbnail: Thumbnail | null,
    tags: string[],
    video: string | null,
    short_description: string | null,
    likes_count: number,
    likes: string[]
  }
  
  export interface InsertPost {
    title: string,
    content: string,
    thumbnail: Thumbnail | null,
    video?: string | null,
    tags?: string[],
    short_description?: string | null,
  }
  
  export interface PaginatedPosts {
    count: number,
    next: string | null,
    previous: string | null,
    results: Post[],
  }
  
  export interface TrendingPosts {
    message: string,
    data: Post[]
  }
  
  export interface PartialUserUpdate {
    first_name: string,
    last_name: string,
    avatar: string,

  }