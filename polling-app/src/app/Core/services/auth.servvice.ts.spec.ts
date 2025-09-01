import { TestBed } from '@angular/core/testing';

import { AuthServviceTs } from './auth.servvice.ts';

describe('AuthServviceTs', () => {
  let service: AuthServviceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthServviceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
