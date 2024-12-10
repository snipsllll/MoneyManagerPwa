import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZahlungDialogComponent } from './zahlung-dialog.component';

describe('ZahlungDialogComponent', () => {
  let component: ZahlungDialogComponent;
  let fixture: ComponentFixture<ZahlungDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ZahlungDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZahlungDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
