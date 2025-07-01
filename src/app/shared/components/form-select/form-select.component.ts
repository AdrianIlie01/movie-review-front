import {Component, ElementRef, HostListener, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-form-select',
  standalone: false,

  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.css'
})
export class FormSelectComponent {
  constructor(private el: ElementRef) {}

  @Input() formGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() selectedOptions: boolean = false;
  @Input() label!: string;
  @Input() options: string[] = [];
  @Input() submitted = false;
  @Input() errors: { [key: string]: string } = {};

  isOpen = false;

  get control() {
    return this.formGroup.get(this.controlName);
  }

  ngOnInit(): void {
    if (!this.control?.value) {
      this.control?.setValue([]);
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: string) {
    const current: string[] = this.control?.value || [];
    let updated: string[];

    if (current.includes(option)) {
      updated = current.filter(v => v !== option);
    } else {
      updated = [...current, option];
    }

    this.control?.setValue(updated);
    this.control?.markAsTouched();

    this.selectedOptions = updated.length > 0;
  }


  isSelected(option: string): boolean {
    return this.control?.value?.includes(option);
  }

  get selectedLabels(): string {
    const current: string[] = this.control?.value || [];
    return this.options
      .filter(opt => current.includes(opt))
      .map(opt => this.toTitleCase(opt))
      .join(', ') || 'Select options';
  }

  toTitleCase(str: string): string {
    return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: any) {
    if (!this.el.nativeElement.contains(targetElement)) {
      this.isOpen = false;
    }
  }

}
