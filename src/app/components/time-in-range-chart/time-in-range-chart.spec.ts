import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeInRangeChart } from './time-in-range-chart';

describe('TimeInRangeChart', () => {
  let component: TimeInRangeChart;
  let fixture: ComponentFixture<TimeInRangeChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeInRangeChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeInRangeChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
