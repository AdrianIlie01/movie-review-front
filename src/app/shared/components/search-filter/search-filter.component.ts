import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MovieTypes} from '../../enums/movie-types';
import {PersonRoles} from '../../enums/person-roles';
import {HomeService} from '../../../features/home/services/home.service';
import {FilterOption} from '../../interfaces/filter-option.interface';
import {SortOption} from '../../interfaces/sort-option.interface';

@Component({
  selector: 'app-search-filter',
  standalone: false,
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.css'
})
export class SearchFilterComponent implements OnInit {

  form!: FormGroup;
  filterPanelOpen = false;

  category: 'movie' | 'cast' = 'movie';
  name = '';
  currentYear = new Date().getFullYear();
  minYear = 1900;
  movie = true;
  person = false;

  protected movieTypeOptions = Object.entries(MovieTypes).map(([_, value]) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1)
  }));

  protected personRoleOptions = Object.entries(PersonRoles).map(([_, value]) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1)
  }));

  @Output() search = new EventEmitter<{
    name: string;
    category: 'movie' | 'cast';
    filterValue: any;
    sortField: string;
    sortOrder: 'ASC' | 'DESC';
  }>();

  @Output() reset = new EventEmitter<void>();
  @Input() hideCategorySelect = false;
  @Input() categoryDisplayed: "movie" | "cast" = 'movie';

  constructor(
    private homeService: HomeService,
    private fb: FormBuilder,
    private el: ElementRef,
  ) {}

  filtersMovie: FilterOption[] = [
    { key: 'type', label: 'Genres', type: 'select', options: this.movieTypeOptions },
    { key: 'releaseYear', label: 'Release Year', type: 'number', options: [] },
    { key: 'ratingMin', label: 'Rating From', type: 'number', options: [] }
  ];

  filtersCast: FilterOption[] = [
    { key: 'roles', label: 'Roles', type: 'select', options: this.personRoleOptions },
    { key: 'born', label: 'Year of Birth', type: 'number', options: [] },
    { key: 'ratingMin', label: 'Rating From', type: 'number', options: [] }
  ];

  sortMovie: SortOption[] = [
    { value: 'name', label: 'Name' },
    { value: 'type', label: 'Genre' },
    { value: 'release_year', label: 'Release Year' },
    { value: 'rating', label: 'Rating' }
  ];

  sortCast: SortOption[] = [
    { value: 'name', label: 'Name' },
    { value: 'born', label: 'Born' },
    { value: 'rating', label: 'Rating' },
    { value: 'roles', label: 'Role' }
  ];

  sortOrderOptions: FilterOption[] = [
    { key: 'ASC', label: '▲ ASC', type: 'text', options: [] },
    { key: 'DESC', label: '▼ DESC', type: 'text', options: [] }
  ];

  sortOptions = [
    { value: 'ASC', label: '▲ ASC'},
    { value: 'DESC', label: '▼ DESC'}
  ];

  categoryOptions = [
    { value: 'movie', label: 'Movie' },
    { value: 'cast', label: 'Cast' }
  ];

  ngOnInit(): void {
    let controlsConfig: any = {
      name: [''],
      category: ['movie'],
      sortField: ['name'],
      sortOrder: ['ASC'],
      filterValueType: [[]],
      filterValueRoles: [[]],
    };

    if (this.categoryDisplayed == 'cast') {
      controlsConfig.category = ['cast'];
      this.category = 'cast';
      this.movie = false;
      this.person = true;

      controlsConfig.sortField = [this.sortCast[0].value];
    }

    this.filtersMovie.forEach(f => {
      if (f.key !== 'type') {
        if (f.key === 'ratingMin') {
          controlsConfig['filterValue_' + f.key] = ['', [Validators.min(0), Validators.max(10)]];
        } else if (f.key === 'releaseYear') {
          controlsConfig['filterValue_' + f.key] = ['', [Validators.min(this.minYear), Validators.max(this.currentYear), Validators.pattern(/^\d+$/)]];
        } else {
          controlsConfig['filterValue_' + f.key] = [''];
        }
      }
    });

    this.filtersCast.forEach(f => {
      if (f.key !== 'roles') {
        if (f.key === 'ratingMin') {
          controlsConfig['filterValue_' + f.key] = ['', [Validators.min(0), Validators.max(10)]];
        } else if (f.key === 'born') {
          controlsConfig['filterValue_' + f.key] = ['', [Validators.min(this.minYear), Validators.max(this.currentYear), Validators.pattern(/^\d+$/)]];
        } else {
          controlsConfig['filterValue_' + f.key] = [''];
        }
      }
    });

    this.form = this.fb.group(controlsConfig);
  }

  get activeFilters(): FilterOption[] {
    if (this.categoryDisplayed == 'cast') {
      return this.category === 'cast' ? this.filtersCast : this.filtersMovie;
    }
    return this.category === 'movie' ? this.filtersMovie : this.filtersCast;
  }

  get activeSortOptions(): SortOption[] {
    return this.category === 'movie' ? this.sortMovie : this.sortCast;
  }

  toggleFilterPanel() {
    this.filterPanelOpen = !this.filterPanelOpen;
  }

  onCategoryChange(selectedValue: string) {
    this.category = selectedValue as 'movie' | 'cast';

    this.movie = selectedValue === 'movie';
    this.person = !this.movie;

    this.form.patchValue({
      filterValueType: [],
      filterValueRoles: [],
    });

    this.activeFilters.forEach(f => {
      if (f.key !== 'type' && f.key !== 'roles') {
        this.form.get('filterValue_' + f.key)?.setValue('');
      }
    });

    this.form.patchValue({
      category: selectedValue,
      sortField: this.activeSortOptions[0].value,
      sortOrder: 'ASC'
    });
  }

  onSearch() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;
    const filterValue: any = {};

    if (val.category === 'movie') {
      filterValue.type = val.filterValueType;
      this.filtersMovie.forEach(f => {
        if (f.key !== 'type') {
          const key = 'filterValue_' + f.key;
          if (val[key]) {
            filterValue[f.key] = val[key];
          }
        }
      });
    } else {
      filterValue.roles = val.filterValueRoles;
      this.filtersCast.forEach(f => {
        if (f.key !== 'roles') {
          const key = 'filterValue_' + f.key;
          if (val[key]) {
            filterValue[f.key] = val[key];
          }
        }
      });
    }

    this.search.emit({
      name: val.name.trim(),
      category: val.category,
      filterValue,
      sortField: val.sortField,
      sortOrder: val.sortOrder
    });

    this.filterPanelOpen = false;
  }

  resetFilters() {
    const defaultCategory = this.categoryDisplayed || 'movie';
    this.form.reset({
      name: '',
      category: defaultCategory,
      sortField: 'name',
      sortOrder: 'ASC',
      filterValueType: [],
      filterValueRoles: []
    });
    this.category = defaultCategory;
    this.movie = defaultCategory === 'movie';
    this.person = defaultCategory === 'cast';

    this.filterPanelOpen = false;
    this.reset.emit();
  }
}


