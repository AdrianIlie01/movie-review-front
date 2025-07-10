import {PersonRoles} from '../enums/person-roles';

export interface AddRolesForMovieInterface {
  roles: PersonRoles[];
  movie: string;
}
