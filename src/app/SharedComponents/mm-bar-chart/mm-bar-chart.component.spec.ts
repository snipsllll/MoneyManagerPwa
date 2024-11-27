import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MmBarChartComponent } from './mm-bar-chart.component';

describe('MmBarChartComponent', () => {
  let component: MmBarChartComponent;
  let fixture: ComponentFixture<MmBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MmBarChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MmBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
