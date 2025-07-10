import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPersonsPerRoleComponent } from './add-persons-per-role.component';

describe('AddPersonsPerRoleComponent', () => {
  let component: AddPersonsPerRoleComponent;
  let fixture: ComponentFixture<AddPersonsPerRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPersonsPerRoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPersonsPerRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
