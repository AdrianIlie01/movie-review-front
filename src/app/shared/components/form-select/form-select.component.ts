import {Component, ElementRef, HostListener, Input, OnInit} from '@angular/core';
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
  // @Input() options: string[] = [];
  @Input() options: (string | { label: string; value: string })[] = [];

  @Input() submitted = false;
  @Input() errors: { [key: string]: string } = {};

  isOpen = false;

  getOptionValue(option: any): string {
    return typeof option === 'string' ? option : option.value;
  }

  getOptionLabel(option: any): string {
    return typeof option === 'string' ? this.toTitleCase(option) : this.toTitleCase(option.label);
  }


  get control() {
    return this.formGroup.get(this.controlName);
  }

  // get controlValue(): string[] {
  //   const val = this.control?.value;
  //   return Array.isArray(val) ? val : [];
  // }

  get controlValue(): string[] | string {
    const val = this.control?.value;
    return this.multiple ? (Array.isArray(val) ? val : []) : val;
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
      this.control?.setValue(updated);
      this.selectedOptions = updated.length > 0;
    } else {
      // single select - setezi valoarea direct și închizi dropdown-ul
      this.control?.setValue(value);
      this.selectedOptions = true;
      this.isOpen = false;
    }
    this.control?.markAsTouched();

    // const current: string[] = this.control?.value || [];
    // let updated: string[];
    //
    // if (current.includes(option)) {
    //   updated = current.filter(v => v !== option);
    // } else {
    //   updated = [...current, option];
    // }
    //
    // this.control?.setValue(updated);
    // this.control?.markAsTouched();
    //
    // this.selectedOptions = updated.length > 0;
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

  // isSelected(option: string): boolean {
  //   return this.control?.value?.includes(option);
  // }

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
    // if (!this.options || !Array.isArray(this.options)) return '';
    //
    // const current: string[] = this.control?.value || [];
    //
    // return this.options
    //   .filter(opt => current.includes(this.getOptionValue(opt)))
    //   .map(opt => this.getOptionLabel(opt))
    //   .join(', ') || 'Select options';
  }

  // get selectedLabels(): string {
  //
  //   if (!this.options || !Array.isArray(this.options)) return '';
  //   // return this.options.filter(option => /* ceva */);
  //
  //   const current: string[] = this.control?.value || [];
  //   return this.options
  //     .filter(opt => current.includes(opt))
  //     .map(opt => this.toTitleCase(opt))
  //     .join(', ') || 'Select options';
  // }

  isPlaceholder(): boolean {
    const value = this.control?.value;

    if (!this.multiple) {
      return value.length === 0;
    }
    if (this.multiple) {
      if (!Array.isArray(value)) return true;
      return value.length === 0;
    }

    // pentru single select, verifici valoarea și dacă începe cu 'select'
    if (typeof value === 'string' && value.toLowerCase().startsWith('select')) {
      console.log('signle + select starts')
      return true;
    }

    return !value;
  }


  toTitleCase(str: string): string {

    return str
      .replace(/[_-]/g, ' ')                              // înlocuiește _ și - cu spațiu
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')             // adaugă spațiu înainte de litere mari
      .replace(/\b\w/g, c => c.toUpperCase());      }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: any) {
    if (!this.el.nativeElement.contains(targetElement)) {
      this.isOpen = false;
    }
  }

}
