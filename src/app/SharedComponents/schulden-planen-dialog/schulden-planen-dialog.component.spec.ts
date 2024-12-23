import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchuldenPlanenDialogComponent } from './schulden-planen-dialog.component';

describe('SchuldenPlanenDialogComponent', () => {
  let component: SchuldenPlanenDialogComponent;
  let fixture: ComponentFixture<SchuldenPlanenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchuldenPlanenDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchuldenPlanenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
