import { Component, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class FormInputComponent {
  @Input() label!: string;
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() controlName!: string;
  @Input() submitted = false;
  @Input() errors: { [key: string]: string } = {};

  constructor(private controlContainer: ControlContainer) {}

  get formGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  protected readonly Object = Object;
}
