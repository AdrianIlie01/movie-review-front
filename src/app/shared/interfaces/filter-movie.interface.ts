import {MovieTypes} from '../enums/movie-types';

export interface FilterMovie {
  name?: string;
  type?: MovieTypes[];
  releaseYear?: string;
  ratingMin?: number;
  sortField?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}
