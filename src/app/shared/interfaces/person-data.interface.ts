export interface PersonDataInterface {
  id: string;
  name: string;
  born: string;
  roles: string[];
  rating: number;
  thumbnail?: string | null;
  description?: string;
}
