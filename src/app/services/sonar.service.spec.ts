import { TestBed } from '@angular/core/testing';

import { SonarService } from './sonar.service';

describe('SonarService', () => {
  let service: SonarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SonarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
