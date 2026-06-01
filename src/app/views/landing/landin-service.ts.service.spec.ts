/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LandinServiceTsService } from './landin-service.ts.service';

describe('Service: LandinService.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LandinServiceTsService]
    });
  });

  it('should ...', inject([LandinServiceTsService], (service: LandinServiceTsService) => {
    expect(service).toBeTruthy();
  }));
});
