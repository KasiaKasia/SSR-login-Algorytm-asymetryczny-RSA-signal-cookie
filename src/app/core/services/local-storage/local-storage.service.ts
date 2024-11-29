export interface StorageService extends Storage {}

import { isPlatformBrowser } from '@angular/common';
import { inject, Inject, InjectionToken, PLATFORM_ID } from '@angular/core';

export const LOCAL_STORAGE: InjectionToken<Storage> = new InjectionToken<Storage| null>('LOCAL_STORAGE_TOKEN', {
    providedIn: 'root',
    factory: () => {
      const platformId = inject(PLATFORM_ID);
      return isPlatformBrowser(platformId) ? window.localStorage : null;
  },
});


import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public constructor(@Inject(LOCAL_STORAGE) private storage: Storage) {}

  public get length(): number {
      return this.storage.length;
  }

  public clear(): void {
      this.storage.clear();
  }

  public getItem(key: string): string | null {
      return this.storage.getItem(key);
  }

  public key(index: number): string | null {
      return this.storage.key(index);
  }

  public removeItem(key: string): void {
      this.storage.removeItem(key);
  }

  public setItem(key: string, value: string): void {
      this.storage.setItem(key, value);
  }
}
