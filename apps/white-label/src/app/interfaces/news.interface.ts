export interface News {
  id?: number;
  headline?: string;
  eye?: string;
  image?: string;
  published_date?: Date;
  archived?: boolean;
  content?: string;
  news_comment_url?: string;
  news_like_url?: string;
  likes_count?: number;
  comments_count?: number;
  article_type?: string;
  images?: string;
}
