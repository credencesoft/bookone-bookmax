import { TestBed } from '@angular/core/testing';

import { WpapiService } from './wpapi.service';

describe('WpapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WpapiService = TestBed.get(WpapiService);
    expect(service).toBeTruthy();
  });
});
