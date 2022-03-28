import { TestBed } from '@angular/core/testing';

import { BaseWebServiceService } from './base-web-service.service';

describe('BaseWebServiceService', () => {
  let service: BaseWebServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseWebServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
