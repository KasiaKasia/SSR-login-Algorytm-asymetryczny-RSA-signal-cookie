import { CanLoadFn, Route, UrlSegment } from '@angular/router';
import { RolesLocalStorageService } from '../services/local-storage/roles-local-storage/roles-local-storage.service';
import { inject } from '@angular/core';

export const canLoadGuard: CanLoadFn = (route: Route, segments: UrlSegment[]) => {

  const roles = inject(RolesLocalStorageService).getAccessUser()
  let urlPath = route.path;

  if (urlPath === 'can-load' && roles?.includes('admin')) return false;
  return true;
};
