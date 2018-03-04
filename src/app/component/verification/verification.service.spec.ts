import { TestBed, inject } from '@angular/core/testing';

import { VerfiicationService } from './verfiication.service';

describe('VerfiicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerfiicationService]
    });
  });

  it('should be created', inject([VerfiicationService], (service: VerfiicationService) => {
    expect(service).toBeTruthy();
  }));
});
