import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistanceSliderComponent } from './distance-slider.component';

describe('DistanceSliderComponent', () => {
  let component: DistanceSliderComponent;
  let fixture: ComponentFixture<DistanceSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DistanceSliderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DistanceSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
