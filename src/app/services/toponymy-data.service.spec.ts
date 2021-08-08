import { TestBed } from '@angular/core/testing';

import { ToponymyDataService } from './toponymy-data.service';

describe('ToponymyDataService', () => {
  let service: ToponymyDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToponymyDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
