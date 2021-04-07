export interface Comments {
  id?: number;
  user?: number;
  user_name?: string;
  user_email?: string;
  comment: string;
  content_type?: number;
  object_pk?: string;
  site?: number;
  ip_address?: string;
  submit_date?: Date;
}
