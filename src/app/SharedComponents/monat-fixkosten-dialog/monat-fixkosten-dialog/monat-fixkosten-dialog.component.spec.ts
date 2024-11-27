import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonatFixkostenDialogComponent } from './monat-fixkosten-dialog.component';

describe('MonatFixkostenDialogComponent', () => {
  let component: MonatFixkostenDialogComponent;
  let fixture: ComponentFixture<MonatFixkostenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonatFixkostenDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonatFixkostenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
