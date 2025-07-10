import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePersonFilmographyComponent } from './manage-person-filmography.component';

describe('AddPersonWithRolesToMoviesComponent', () => {
  let component: ManagePersonFilmographyComponent;
  let fixture: ComponentFixture<ManagePersonFilmographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManagePersonFilmographyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePersonFilmographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
