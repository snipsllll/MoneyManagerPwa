import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuchungenListDayComponent } from './buchungen-list-day.component';

describe('BuchungenListDayComponent', () => {
  let component: BuchungenListDayComponent;
  let fixture: ComponentFixture<BuchungenListDayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuchungenListDayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuchungenListDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
