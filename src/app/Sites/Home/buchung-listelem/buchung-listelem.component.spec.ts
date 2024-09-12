import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuchungListelemComponent } from './buchung-listelem.component';

describe('BuchungListelemComponent', () => {
  let component: BuchungListelemComponent;
  let fixture: ComponentFixture<BuchungListelemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuchungListelemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuchungListelemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
