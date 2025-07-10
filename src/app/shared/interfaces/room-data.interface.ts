export interface RoomDataInterface {
  id: string;
  name: string;
  stream_url: string;
  thumbnail?: string | null;
  type?: string[];
  release_year: string;
}
