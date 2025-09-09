import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GmiChart } from './gmi-chart';

describe('GmiChart', () => {
  let component: GmiChart;
  let fixture: ComponentFixture<GmiChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GmiChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GmiChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
