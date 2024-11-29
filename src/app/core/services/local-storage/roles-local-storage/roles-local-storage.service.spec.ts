import { TestBed } from '@angular/core/testing';
import { RolesLocalStorageService } from './roles-local-storage.service';

describe('RolesLocalStorageService', () => {
  let service: RolesLocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesLocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
