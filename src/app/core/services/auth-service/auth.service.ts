import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../../models/user';
import { Observable, tap } from 'rxjs';
import { Settings } from '../../../shared/config/settings';
import { RolesLocalStorageService } from '../local-storage/roles-local-storage/roles-local-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);

  #userSignal = signal<User | null>(null)
  user = this.#userSignal.asReadonly()
  isLoggedIn = computed(() => !!this.user())

  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private storage: RolesLocalStorageService) { }

  login(user: User): Observable<any> {

    return this.http
      .post(Settings.API_LOGIN, JSON.stringify(user), this.httpOptions)
      .pipe(
        tap((data: any) => {
          if (data) {
            this.storage.setAccessUser(data.respons.user.role)
            this.#userSignal.set(data.respons.user);
            this.startTokenRefreshInterval();
          }
        })
      );
  }

  refreshToken(): Observable<{ accessToken: string; }> {
    return this.http.post<any>(Settings.API_REFRESH_TOKEN, {}, {
      withCredentials: true,
    })
  }

  logout() {
    this.storage.removeAccessUser();
    this.#userSignal.set(null)
    this.router.navigate(['/login']);
  }

  private isRefreshingToken = false;

  startTokenRefreshInterval(): void {
    setInterval(() => {
      if (!this.isRefreshingToken) {
        this.isRefreshingToken = true;
        this.refreshToken().subscribe({
          next: () => {
            console.log('Token został pomyślnie odświeżony.');
            this.isRefreshingToken = false;
          },
          error: (err) => {
            console.error('Błąd podczas odświeżania tokena:', err);
            this.isRefreshingToken = false;
          },
        });
      }
    }, 60 * 1000); // 1 minuta
  }
}
