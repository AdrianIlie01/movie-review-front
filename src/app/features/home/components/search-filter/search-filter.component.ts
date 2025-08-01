import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { MovieTypes } from '../../../../shared/enums/movie-types';
import { PersonRoles } from '../../../../shared/enums/person-roles';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../../services/home.service';

interface Option {
  key: string;
  label: string;
  type: string;
  options: { value: string; label: string }[] | [];
}

interface SortOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-search-filter',
  standalone: false,
  templateUrl: './search-filter.component.html',
  styleUrl: './search-filter.component.css'
})
export class SearchFilterComponent implements OnInit {

  form!: FormGroup;
  filterPanelOpen = false;
  isOpen = false;
  isOpenOrder = false;
  isOpenCategory = false;

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

  filtersMovie: Option[] = [
    { key: 'type', label: 'Movie Genres', type: 'select', options: this.movieTypeOptions },
    { key: 'releaseYear', label: 'Release Year', type: 'number', options: [] },
    { key: 'ratingMin', label: 'Min Rating', type: 'number', options: [] }
  ];

  filtersCast: Option[] = [
    { key: 'roles', label: 'Roles', type: 'select', options: this.personRoleOptions },
    { key: 'born', label: 'Year of Birth', type: 'number', options: [] },
    { key: 'ratingMin', label: 'Min Rating', type: 'number', options: [] }
  ];

  sortMovie: SortOption[] = [
    { value: 'name', label: 'Name' },
    { value: 'releaseYear', label: 'Release Year' },
    { value: 'ratingMin', label: 'Min Rating' }
  ];

  sortCast: SortOption[] = [
    { value: 'name', label: 'Name' },
    { value: 'born', label: 'Born' },
    { value: 'ratingMin', label: 'Min Rating' }
  ];

  sortOrderOptions: Option[] = [
    { key: 'ASC', label: '▲ ASC', type: 'text', options: [] },
    { key: 'DESC', label: '▼ DESC', type: 'text', options: [] }
  ];

  @Output() search = new EventEmitter<{
    name: string;
    category: 'movie' | 'cast';
    filterValue: any;
    sortField: string;
    sortOrder: 'ASC' | 'DESC';
  }>();

  @Output() reset = new EventEmitter<void>();

  constructor(
    private homeService: HomeService,
    private fb: FormBuilder,
    private el: ElementRef,
  ) {}

  // Close dropdowns when clicking outside component
  @HostListener('document:click', ['$event.target'])
  onClickOutsideCategory(targetElement: any) {
    if (!this.el.nativeElement.contains(targetElement)) {
      this.isOpenCategory = false;
    }
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: any) {
    if (!this.el.nativeElement.contains(targetElement)) {
      this.isOpen = false;
    }
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutsideSort(targetElement: any) {
    if (!this.el.nativeElement.contains(targetElement)) {
      this.isOpenOrder = false;
    }
  }

  toggleOpen(event: Event): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  closeDropdown(): void {
    this.isOpen = false;
  }

  toggleOpenOrder(event: Event): void {
    event.stopPropagation();
    this.isOpenOrder = !this.isOpenOrder;
  }

  closeDropdownOrder(): void {
    setTimeout(() => {
      this.isOpenOrder = false;
    }, 100);
  }

  toggleOpenCategory(event: Event): void {
    event.stopPropagation();
    this.isOpenCategory = !this.isOpenCategory;
  }

  closeDropdownCategory(): void {
    this.isOpenCategory = false;
  }

  ngOnInit(): void {
    const controlsConfig: any = {
      name: [''],
      category: ['movie'],
      sortField: ['name'],
      sortOrder: ['ASC'],
      filterValueType: [[]],
      filterValueRoles: [[]],
    };

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

  get activeFilters(): Option[] {
    return this.category === 'movie' ? this.filtersMovie : this.filtersCast;
  }

  get activeSortOptions(): SortOption[] {
    return this.category === 'movie' ? this.sortMovie : this.sortCast;
  }

  toggleFilterPanel() {
    this.filterPanelOpen = !this.filterPanelOpen;
  }

  onCategoryChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    this.category = selectedValue as 'movie' | 'cast';

    this.movie = this.category === 'movie';
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
    this.form.reset({
      name: '',
      category: 'movie',
      sortField: 'name',
      sortOrder: 'ASC',
      filterValueType: [],
      filterValueRoles: []
    });
    this.category = 'movie';
    this.reset.emit();
  }
}
