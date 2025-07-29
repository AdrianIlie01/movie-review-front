import {PersonRoles} from '../enums/person-roles';

export interface FilterCast {
  name?: string;
  born?: string;
  roles?: PersonRoles[];
  ratingMin?: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}
