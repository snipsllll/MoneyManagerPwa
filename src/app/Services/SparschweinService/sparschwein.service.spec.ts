import { TestBed } from '@angular/core/testing';

import { SparschweinService } from './sparschwein.service';

describe('SparschweinService', () => {
  let service: SparschweinService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SparschweinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
