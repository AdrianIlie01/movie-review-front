import { Injectable } from '@angular/core';
import {AbstractControl, FormGroup, ValidationErrors} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidatorsService {

  constructor() { }

  requiredTrimmed(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (typeof value === 'string' && value.trim() === '') {
      return { requiredTrimmed: true };
    }
    return null;
  }

  trimAllStringControls(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && typeof control.value === 'string') {
        const trimmed = control.value.trim();
        // Only update the control if trimmed value differs to avoid unnecessary events
        if (trimmed !== control.value) {
          // Update control value without emitting valueChanges event
          control.setValue(trimmed, { emitEvent: false });
        }
      }
    });
  }

  trimSelectedStringControls(form: FormGroup, controlNames: string[]): void {
    controlNames.forEach(controlName => {
      const control = form.get(controlName);
      if (control && typeof control.value === 'string') {
        const trimmed = control.value.trim();
        if (trimmed !== control.value) {
          control.setValue(trimmed, { emitEvent: false });
        }
      }
    });
  }

}
