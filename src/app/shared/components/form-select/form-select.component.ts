import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-form-select',
  standalone: false,

  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.css'
})
export class FormSelectComponent implements OnInit{
  constructor(private el: ElementRef) {}

  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() selectedOptions: boolean = false;
  @Input() multiple: boolean = true;
  @Input() label!: string;

  _options: (string | { label: string; value: string })[] = [];
  isOpen = false;

  @Input()
  set options(opts: (string | { label: string; value: string })[]) {
    if (!opts) {
      this._options = [];
      return;
    }

    // sort after label or string
    this._options = [...opts].sort((a, b) => {
      const aLabel = typeof a === 'string' ? a.toLowerCase() : a.label.toLowerCase();
      const bLabel = typeof b === 'string' ? b.toLowerCase() : b.label.toLowerCase();

      return aLabel.localeCompare(bLabel);
    });
  }

  @Input() submitted = false;
  @Input() errors: { [key: string]: string } = {};
  @Output() valueChange = new EventEmitter<any>();

  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: any) {
    if (!this.el.nativeElement.contains(targetElement)) {
      this.isOpen = false;
    }
  }

  onSelectionChange(value: any) {
    this.formGroup.get(this.controlName)?.setValue(value);
    this.valueChange.emit(value);
  }

  get options() {
    return this._options;
  }

  getOptionValue(option: any): string {
    return typeof option === 'string' ? option : option.value;
  }

  getOptionLabel(option: any): string {
    return typeof option === 'string' ? this.toTitleCase(option) : this.toTitleCase(option.label);
  }


  get control() {
    return this.formGroup.get(this.controlName);
  }
  ngOnInit(): void {
    if (!this.control?.value) {
      this.control?.setValue([]);
    }
    this.selectedOptions = this.control?.value?.length > 0;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
  selectOption(option: string | { label: string; value: string }) {
    const value = this.getOptionValue(option);

    if (this.multiple) {
      const current: string[] = this.control?.value || [];
      let updated: string[];

      if (current.includes(value)) {
        updated = current.filter(v => v !== value);
      } else {
        updated = [...current, value];
      }

      this.onSelectionChange(updated);
      this.selectedOptions = updated.length > 0;
    } else {
      this.onSelectionChange(value);
      this.selectedOptions = true;
      this.isOpen = false;
    }

    this.control?.markAsTouched();
  }


  isSelected(option: any): boolean {
    const value = this.getOptionValue(option);
    const controlValue = this.control?.value;

    if (this.multiple) {
      return Array.isArray(controlValue) && controlValue.includes(value);
    } else {
      return controlValue === value;
    }
  }

  get selectedLabels(): string {

    if (!this.options || !Array.isArray(this.options)) return '';

    const value = this.control?.value;

    if (this.multiple) {
      const current: string[] = Array.isArray(value) ? value : [];
      return this.options
        .filter(opt => current.includes(this.getOptionValue(opt)))
        .map(opt => this.getOptionLabel(opt))
        .join(', ') || 'Select options';
    } else {
      const selected = this.options.find(opt => this.getOptionValue(opt) === value);
      return selected ? this.getOptionLabel(selected) : 'Select option';
    }

  }

  isPlaceholder(): boolean {
    const value = this.control?.value;

    if (!this.multiple) {
      return value.length === 0;
    }
    if (this.multiple) {
      if (!Array.isArray(value)) return true;
      return value.length === 0;
    }

    //  for single string select, verify value and if it start with select
    if (typeof value === 'string' && value.toLowerCase().startsWith('select')) {
      return true;
    }

    return !value;
  }


  toTitleCase(str: string): string {

    return str
      .replace(/[_-]/g, ' ')
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, c => c.toUpperCase());      }


  get sortedOptions() {
    if (!this.options || !this.control) return [];

    const selectedValues = this.control.value;

    const selectedArray = this.multiple
      ? (Array.isArray(selectedValues) ? selectedValues : [])
      : [selectedValues];

    return [...this.options].sort((a, b) => {
      const aVal = this.getOptionValue(a);
      const bVal = this.getOptionValue(b);

      const aSelected = selectedArray.includes(aVal);
      const bSelected = selectedArray.includes(bVal);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return 0;
    });
  }

}
