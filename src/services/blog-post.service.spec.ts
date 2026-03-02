/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BlogPostService } from './blog-post.service';

describe('Service: Places', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlogPostService]
    });
  });

  it('should ...', inject([BlogPostService], (service: BlogPostService) => {
    expect(service).toBeTruthy();
  }));
});
