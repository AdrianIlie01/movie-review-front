import {AfterContentInit, Component, ContentChild, ElementRef, Input} from '@angular/core';
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
export class FormComponent implements AfterContentInit {
  @Input() title?: string;
  @Input() autocomplete?: string;
  @Input() formGroup!: FormGroup; // the usual formGroup from a form
  // if i use other name than formGroup it will not work
  // - it needs to be the same name with the Angular directive from a normal form
  @Input() formButtonName!: ButtonName;
  @Input() formFunction!: () => void | Promise<void> | Promise<boolean>;
  @Input() errorMessage: string[] | null | undefined = [];
  @Input() hasSpecialTitle: boolean = false;

  hasTitleSlot = false;
  // Gets reference to the first element with [form-title] in projected content
  @ContentChild('[form-title]', { static: true, read: ElementRef }) titleSlot?: ElementRef;

  // Called after projected content is initialized
  ngAfterContentInit() {
    // Check if titleSlot @ContentChild('[form-title] exists and set the flag accordingly
    // e.g = <div form-title></div> - when using it

    // todo its not ok cuz i relay on titleSlot wich may not even be there

    this.hasTitleSlot = !!this.titleSlot;
  }

}
