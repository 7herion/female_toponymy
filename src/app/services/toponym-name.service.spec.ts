import { TestBed } from '@angular/core/testing';

import { ToponymNameService } from './toponym-name.service';

describe('NameService', () => {
  let service: ToponymNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToponymNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
