import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuchungenListMonthComponent } from './buchungen-list-month.component';

describe('BuchungenListMonthComponent', () => {
  let component: BuchungenListMonthComponent;
  let fixture: ComponentFixture<BuchungenListMonthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuchungenListMonthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuchungenListMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
