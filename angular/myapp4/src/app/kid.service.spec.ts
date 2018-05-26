import { TestBed, inject } from '@angular/core/testing';

import { KidService } from './kid.service';

describe('KidService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KidService]
    });
  });

  it('should be created', inject([KidService], (service: KidService) => {
    expect(service).toBeTruthy();
  }));
});
