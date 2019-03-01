import { TestBed } from '@angular/core/testing';

import { ApiCorreiosService } from './api-correios.service';

describe('ApiCorreiosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApiCorreiosService = TestBed.get(ApiCorreiosService);
    expect(service).toBeTruthy();
  });
});
