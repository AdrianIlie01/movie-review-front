import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {PersonRoles} from '../../../../shared/enums/person-roles';
import {ButtonName} from '../../../../shared/enums/button-name';
import {PersonService} from '../../services/person.service';
import {PersonInterface} from '../../../../shared/interfaces/person.interface';
import {FormValidatorsService} from '../../../../shared/services/form-validators.service';
@Component({
  selector: 'app-edit-person',
  standalone: false,

  templateUrl: './edit-person.component.html',
  styleUrl: './edit-person.component.css'

})
export class EditPersonComponent implements OnInit {
  protected personForm!: FormGroup;
  protected submitted = false;
  protected errorMessage: string[] | null = null;
  protected personId!: string;

  protected readonly ButtonName = ButtonName;
  protected readonly personRoles = Object.values(PersonRoles);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    protected personService: PersonService,
    protected formValidators: FormValidatorsService
  ) {}

  ngOnInit(): void {
    this.personId = this.route.snapshot.paramMap.get('id') || '';

    this.personForm = this.fb.group({
      name: ['', {
        validators: [Validators.required],
        asyncValidators: [this.personService.validateEditPersonName(this.personId)],
        updateOn: 'blur'
      }],
      roles: [[], Validators.required],
      born: [''], // tip date: YYYY-MM-DD
      description: ['']
    });

    if (this.personId) {
      this.personService.getPerson(this.personId).subscribe({
        next: (data: PersonInterface) => {
          this.personForm.patchValue({
            name: data.name,
            roles: data.roles ?? [],
            born: data.born?.toString().substring(0, 10) || '',
            description: data.description || ''
          });
        },
        error: (err) => {
          this.router.navigateByUrl('/cast/list').then();
        }
      });
    }
  }

  onSubmit(): void {
    this.errorMessage = [];
    this.submitted = true;

    if (this.personForm.invalid || !this.personForm.get('roles')?.value?.length) {
      if (!this.personForm.get('roles')?.value?.length) {
        this.errorMessage = ['Please select at least one role.'];
      }
      return;
    }

    const bornControl = this.personForm.get('born');

    if (bornControl) {
      const bornValue = bornControl.value;
      if (!bornValue || bornValue.trim() === '') {
        bornControl.setValue(null);
      }
    }

    this.formValidators.trimAllStringControls(this.personForm);

    this.personService.updatePerson(this.personForm.value, this.personId).subscribe({
      next: (data) => {
        this.router.navigateByUrl('/cast/list').then();
      },
      error: (err) => {
        if (err.error?.message == 'born must be a valid ISO 8601 date string') {
          this.errorMessage = [];
        }
        if (Array.isArray(err.error?.message)) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = [err.error?.message || 'An error occurred'];
        }
      }
    });
  }
}
