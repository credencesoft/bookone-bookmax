import { TestBed } from '@angular/core/testing';

import { TriggerEventService } from './trigger-event.service';

describe('TriggerEventService', () => {
  let service: TriggerEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TriggerEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
