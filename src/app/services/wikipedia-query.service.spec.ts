import { TestBed } from '@angular/core/testing';

import { WikipediaQueryService } from './wikipedia-query.service';

describe('WikipediaQueryService', () => {
  let service: WikipediaQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WikipediaQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
