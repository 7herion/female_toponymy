import { TestBed } from '@angular/core/testing';

import { InfoDivService } from './info-div.service';

describe('InfoDivService', () => {
  let service: InfoDivService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoDivService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
