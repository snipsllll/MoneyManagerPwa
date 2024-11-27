import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuchungskategorienDialogComponent } from './buchungskategorien-dialog.component';

describe('BuchungskategorienDialogComponent', () => {
  let component: BuchungskategorienDialogComponent;
  let fixture: ComponentFixture<BuchungskategorienDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuchungskategorienDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuchungskategorienDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
