import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuchungDetailsComponent } from './buchung-details.component';

describe('BuchungDetailsComponent', () => {
  let component: BuchungDetailsComponent;
  let fixture: ComponentFixture<BuchungDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuchungDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuchungDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
