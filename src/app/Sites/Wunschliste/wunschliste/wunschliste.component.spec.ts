import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WunschlisteComponent } from './wunschliste.component';

describe('WunschlisteComponent', () => {
  let component: WunschlisteComponent;
  let fixture: ComponentFixture<WunschlisteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WunschlisteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WunschlisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
