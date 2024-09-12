import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixKostenEintragListelemComponent } from './fix-kosten-eintrag-listelem.component';

describe('FixKostenEintragListelemComponent', () => {
  let component: FixKostenEintragListelemComponent;
  let fixture: ComponentFixture<FixKostenEintragListelemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixKostenEintragListelemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixKostenEintragListelemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
