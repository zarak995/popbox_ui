import { TestBed, inject } from '@angular/core/testing';

import { ViewchatService } from './viewchat.service';

describe('ViewchatService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewchatService]
    });
  });

  it('should be created', inject([ViewchatService], (service: ViewchatService) => {
    expect(service).toBeTruthy();
  }));
});
