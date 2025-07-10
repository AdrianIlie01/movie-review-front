import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayPersonFilmographyComponent } from './display-person-filmography.component';

describe('DisplayPersonFilmographyComponent', () => {
  let component: DisplayPersonFilmographyComponent;
  let fixture: ComponentFixture<DisplayPersonFilmographyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DisplayPersonFilmographyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayPersonFilmographyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
