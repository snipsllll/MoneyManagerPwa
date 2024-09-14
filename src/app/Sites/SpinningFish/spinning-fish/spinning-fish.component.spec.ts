import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinningFishComponent } from './spinning-fish.component';

describe('SpinningFishComponent', () => {
  let component: SpinningFishComponent;
  let fixture: ComponentFixture<SpinningFishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpinningFishComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpinningFishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
