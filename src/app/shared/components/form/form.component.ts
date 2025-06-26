import { Component, Input } from '@angular/core';
import {ControlContainer, FormGroup, FormGroupDirective, ReactiveFormsModule} from '@angular/forms';
import { ButtonName } from '../../enums/button-name';
import {CommonModule, NgFor, NgIf} from '@angular/common';
import {FormInputComponent} from '../form-input/form-input.component';
import {SharedModule} from '../../shared.module';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgFor, NgIf, SharedModule],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})
export class FormComponent {
  @Input() title?: string;
  @Input() formGroup!: FormGroup; // the usual formGroup from a form
  // if i use other name than formGroup it will not work
  // - it needs to be the same name with the Angular directive from a normal form
  @Input() formButtonName!: ButtonName;
  @Input() formFunction!: () => void | Promise<void> | Promise<boolean>;
  @Input() errorMessage: string[] | null = [];
}
