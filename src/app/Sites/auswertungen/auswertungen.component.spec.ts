import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuswertungenComponent } from './auswertungen.component';

describe('AuswertungenComponent', () => {
  let component: AuswertungenComponent;
  let fixture: ComponentFixture<AuswertungenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuswertungenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuswertungenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
