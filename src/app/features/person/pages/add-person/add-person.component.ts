import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ButtonName} from '../../../../shared/enums/button-name';
import {PersonRoles} from '../../../../shared/enums/person-roles';
import {PersonService} from '../../services/person.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-person',
  standalone: false,
  templateUrl: './add-person.component.html',
  styleUrl: './add-person.component.css'
})
export class AddPersonComponent implements OnInit {
  protected personForm!: FormGroup;
  protected readonly ButtonName = ButtonName;
  protected submitted = false;
  protected errorMessage: string[] | null = null;
  protected readonly personRoles = Object.values(PersonRoles);
  protected bornValueEmpty!: boolean;
  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private router: Router
  ) {}

  ngOnInit() {
    this.personForm = this.fb.group({
      name: ['', {
        validators: [Validators.required],
        asyncValidators: [this.personService.validatePersonName()],
        updateOn: 'blur'
      }],
      description: [''],
      born: ['', [this.personService.validDateValidator()]],
      roles: [[], Validators.required]
    });


    const bornControl = this.personForm.get('born');

    if (bornControl) {
      const bornValue = bornControl.value;
      if (!bornValue || bornValue.trim() === '') {
        this.bornValueEmpty = true;
        bornControl.setValue(null);
      } else {
        this.bornValueEmpty = false;
      }
    }
  }

  onSubmit() {
    this.errorMessage = [];
    this.submitted = true;

    const roles = this.personForm.get('roles')?.value;

    if (this.personForm.invalid || !roles || roles.length === 0) {
      if (!roles || roles.length === 0) {
        this.errorMessage = ['Please select at least one role.'];
      }
      return;
    }

    const bornControl = this.personForm.get('born');

    if (bornControl) {
      const bornValue = bornControl.value;

      console.log('bornValue');
      console.log(bornValue);

      if (!bornValue || bornValue.trim() === '') {
        this.bornValueEmpty = true;
        bornControl.setValue(null);
      } else {
        this.bornValueEmpty = false;
      }
    }

    this.personService.addPerson(this.personForm.value).subscribe({
      next: () => {
        // console.log('Person added successfully');
        this.router.navigateByUrl('home').then();
      },
      error: (error) => {
        if (Array.isArray(error.error?.message)) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = [error.error?.message || 'An error occurred'];
        }
      }
    });
  }
}
