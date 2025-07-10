export interface UserInterface {
  id: string;
  email: string;
  email_verified_at: string | null;
  username: string;
  role: 'admin' | 'user' | 'moderator' | string;
  status: 'active' | 'inactive' | 'banned' | string;
  is_2_fa_active: boolean;
  create_date: string;
  update_date: string;
}
