import { Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RolesLocalStorageService {

  readonly #ACCESS_USER = 'ACCESS_USER';

  public constructor(private storage: LocalStorageService) { }

  public get userAccess(): [string] | null {
    return this.getAccessUser();
  }

  public setAccessUser(role: string): void {
    this.storage.setItem(this.#ACCESS_USER, JSON.stringify(role));
  }
  
  public removeAccessUser(): void {
    this.storage.removeItem(this.#ACCESS_USER);
  }

  public getAccessUser(): [string] | null {
    const roles = this.storage.getItem(this.#ACCESS_USER);
    return roles ? JSON.parse(roles) : [];
  }
}
