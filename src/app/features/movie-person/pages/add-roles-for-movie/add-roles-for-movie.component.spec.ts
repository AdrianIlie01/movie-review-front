import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRolesForMovieComponent } from './add-roles-for-movie.component';

describe('AddRolesForMovieComponent', () => {
  let component: AddRolesForMovieComponent;
  let fixture: ComponentFixture<AddRolesForMovieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddRolesForMovieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRolesForMovieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
