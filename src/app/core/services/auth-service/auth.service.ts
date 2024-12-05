import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { User } from '../../models/user';
import { Observable, tap, timer } from 'rxjs';
import { Settings } from '../../../shared/config/settings';
import { RolesLocalStorageService } from '../local-storage/roles-local-storage/roles-local-storage.service';
import { Router } from '@angular/router';
import { TokenManager, TokenValidityDetails } from '../../models/token';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private http = inject(HttpClient);
  tokenManager?: TokenValidityDetails;
  #userSignal = signal<User | null>(null)
  user = this.#userSignal.asReadonly()
  isLoggedIn = computed(() => !!this.user())

  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'withCredentials': 'true' })
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
            this.tokenManager = new TokenManager(data.respons.accessTokenDetails.iat, data.respons.accessTokenDetails.exp)
            this.startTokenRefreshInterval();
          }
        })
      );
  }

  refreshToken(): Observable<{ accessToken: string; }> {
    return this.http.post<any>(Settings.API_REFRESH_TOKEN, JSON.stringify(this.user()), {
      withCredentials: true,
    }).pipe(
      takeUntilDestroyed(this.destroyRef),
      tap((data: any) => {
        if (data) {
          this.tokenManager = new TokenManager(data.respons.accessTokenDetails.iat, data.respons.accessTokenDetails.exp)
        }
      })
    );
  }

  logout() {
    this.storage.removeAccessUser();
    this.#userSignal.set(null)
    this.router.navigate(['/login']);
  }


  startTokenRefreshInterval(): void {
    const expirationBuffer = 10; // Odśwież token na 10 sekund przed wygaśnięciem
  
    const scheduleTokenCheck = (timeLeft: number) => {
      const checkInterval = Math.max(1000, (timeLeft - expirationBuffer) * 1000); // Minimalny interwał to 1 sekunda
      timer(checkInterval)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          if (!this.tokenManager) {
            console.error('TokenManager is not initialized.');
            return;
          }
  
          const remainingTime = this.tokenManager.getTimeLeft();
          if (remainingTime <= expirationBuffer) {
            this.refreshToken().subscribe(
              () => {
                console.info('Token successfully refreshed');
                const newTimeLeft = this.tokenManager?.getTimeLeft() || 0;
                scheduleTokenCheck(newTimeLeft); // Zaplanuj ponowne sprawdzenie
              },
              (error) => console.error('Failed to refresh token', error)
            );
          } else {
            scheduleTokenCheck(remainingTime); // Jeśli jeszcze nie czas, zaplanuj kolejne sprawdzenie
          }
        });
    };
  
    if (this.tokenManager) {
      const initialTimeLeft = this.tokenManager.getTimeLeft();
      scheduleTokenCheck(initialTimeLeft);
    } else {
      console.error('TokenManager is not initialized.');
    }
  }  
}

