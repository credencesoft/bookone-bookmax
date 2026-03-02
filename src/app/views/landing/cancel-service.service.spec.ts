/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CancelServiceService } from './cancel-service.service';

describe('Service: CancelService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CancelServiceService]
    });
  });

  it('should ...', inject([CancelServiceService], (service: CancelServiceService) => {
    expect(service).toBeTruthy();
  }));
});
