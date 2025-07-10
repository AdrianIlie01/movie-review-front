import {PersonRoles} from '../enums/person-roles';

export interface AddPersonsSingleRoleToMovieInterface {
  roles?: PersonRoles;
  person: string[];
}
