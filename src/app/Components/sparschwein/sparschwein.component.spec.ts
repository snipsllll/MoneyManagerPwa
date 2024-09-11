import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparschweinComponent } from './sparschwein.component';

describe('SparschweinComponent', () => {
  let component: SparschweinComponent;
  let fixture: ComponentFixture<SparschweinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SparschweinComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SparschweinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
