import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixKostenComponent } from './fix-kosten.component';

describe('FixKostenComponent', () => {
  let component: FixKostenComponent;
  let fixture: ComponentFixture<FixKostenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FixKostenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixKostenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
