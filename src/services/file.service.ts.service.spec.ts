import { TestBed } from '@angular/core/testing';

import { FileServiceTsService } from './file.service.ts.service';

describe('FileServiceTsService', () => {
  let service: FileServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
