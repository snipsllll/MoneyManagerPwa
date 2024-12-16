import { TestBed } from '@angular/core/testing';

import { SavedLoginDataManagerService } from './saved-login-data-manager.service';

describe('SavedLoginDataManagerService', () => {
  let service: SavedLoginDataManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavedLoginDataManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
