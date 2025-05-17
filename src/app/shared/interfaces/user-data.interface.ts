export interface UserDataInterface {
  id: string;
  email: string;
  email_verified_at: string | null;
  username: string;
  password: string;
  role: string;
  status: string;
  is_2_fa_active: boolean;
  refresh_token: string;
  create_date: string;
  update_date: string;
}
