import { TestBed } from '@angular/core/testing';

import { DataChangeService } from './data-change.service';

describe('DataChangeService', () => {
  let service: DataChangeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataChangeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
