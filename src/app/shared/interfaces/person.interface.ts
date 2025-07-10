import {PersonRoles} from '../enums/person-roles';

export interface PersonInterface {
  id: string;
  name: string;
  description?: string;
  born?: Date;
  images?: string[];
  roles: PersonRoles[];
  movieRoles?: any[]
}
