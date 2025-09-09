import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutcomesSummary } from './outcomes-summary';

describe('OutcomesSummary', () => {
  let component: OutcomesSummary;
  let fixture: ComponentFixture<OutcomesSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutcomesSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutcomesSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
