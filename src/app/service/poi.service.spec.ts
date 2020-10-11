import { TestBed } from '@angular/core/testing';

import { POIService } from './poi.service';

describe('POIService', () => {
  let service: POIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(POIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
