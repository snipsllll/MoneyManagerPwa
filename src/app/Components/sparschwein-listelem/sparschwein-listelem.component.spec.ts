import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparschweinListelemComponent } from './sparschwein-listelem.component';

describe('SparschweinListelemComponent', () => {
  let component: SparschweinListelemComponent;
  let fixture: ComponentFixture<SparschweinListelemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SparschweinListelemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SparschweinListelemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
