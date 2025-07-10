import {PersonRoles} from '../enums/person-roles';

export interface AddRolesPersonForSingleMovieInterface {
  roles?: PersonRoles[];
  movies?: string[];
}
