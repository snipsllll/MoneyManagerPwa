import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAuswertungsLayoutDialogComponent } from './create-auswertungs-layout-dialog.component';

describe('CreateAuswertungsLayoutDialogComponent', () => {
  let component: CreateAuswertungsLayoutDialogComponent;
  let fixture: ComponentFixture<CreateAuswertungsLayoutDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAuswertungsLayoutDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAuswertungsLayoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
