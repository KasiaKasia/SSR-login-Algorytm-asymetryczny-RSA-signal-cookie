import { TestBed } from '@angular/core/testing';

import { BasicFormService } from './basic-form.service';

describe('BasicFormService', () => {
  let service: BasicFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasicFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
