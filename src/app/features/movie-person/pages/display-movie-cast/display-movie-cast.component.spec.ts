import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayMovieCastComponent } from './display-movie-cast.component';

describe('DisplayMovieCastComponent', () => {
  let component: DisplayMovieCastComponent;
  let fixture: ComponentFixture<DisplayMovieCastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayMovieCastComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayMovieCastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
