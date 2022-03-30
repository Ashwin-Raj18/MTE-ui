import { TestBed } from '@angular/core/testing';

import { BlackduckService } from './blackduck.service';

describe('BlackduckService', () => {
  let service: BlackduckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlackduckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
