import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuchungenListComponent } from './buchungen-list.component';

describe('BuchungenListComponent', () => {
  let component: BuchungenListComponent;
  let fixture: ComponentFixture<BuchungenListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BuchungenListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuchungenListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
