/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CancelService } from './cancel.service';

describe('Service: Cancel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CancelService]
    });
  });

  it('should ...', inject([CancelService], (service: CancelService) => {
    expect(service).toBeTruthy();
  }));
});
