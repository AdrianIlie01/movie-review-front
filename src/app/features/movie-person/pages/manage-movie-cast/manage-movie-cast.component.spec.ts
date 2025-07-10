import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMovieCastComponent } from './manage-movie-cast.component';

describe('AddPersonsSingleRoleToMovieComponent', () => {
  let component: ManageMovieCastComponent;
  let fixture: ComponentFixture<ManageMovieCastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageMovieCastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageMovieCastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
