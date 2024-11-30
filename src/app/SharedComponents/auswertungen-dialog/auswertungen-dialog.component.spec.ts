import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuswertungenDialogComponent } from './auswertungen-dialog.component';

describe('AuswertungenDialogComponent', () => {
  let component: AuswertungenDialogComponent;
  let fixture: ComponentFixture<AuswertungenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuswertungenDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuswertungenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
