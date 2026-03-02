/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LandinService.tsService } from './landin-service.ts.service';

describe('Service: LandinService.ts', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LandinService.tsService]
    });
  });

  it('should ...', inject([LandinService.tsService], (service: LandinService.tsService) => {
    expect(service).toBeTruthy();
  }));
});
