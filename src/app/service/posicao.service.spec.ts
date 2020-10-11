import { TestBed } from '@angular/core/testing';

import { PosicaoService } from './posicao.service';

describe('PosicaoService', () => {
  let service: PosicaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PosicaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
