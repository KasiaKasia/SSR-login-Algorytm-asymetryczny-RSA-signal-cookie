import { Injectable } from '@angular/core';
import { Cookie } from '../../models/cookie';

@Injectable({
  providedIn: 'root'
})
export class CookiesService implements Cookie {

  getCookie(name: string): string | null {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const [key, value] = cookie.split('=');
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }
  setCookie(name: string, value: string, options: { [key: string]: any } = {}): void {
    const optionsString = Object.entries(options)
      .map(([key, optionValue]) => {
        if (key === 'expires' && optionValue instanceof Date) {
          return `expires=${optionValue.toUTCString()}`;
        }
        return `${key}=${optionValue}`;
      })
      .join('; ');

    document.cookie = `${name}=${encodeURIComponent(value)}; ${optionsString}`;
  }
  deleteCookie(name: string): void {
    this.setCookie(name, '', { 'max-age': -1 });
  }
}
