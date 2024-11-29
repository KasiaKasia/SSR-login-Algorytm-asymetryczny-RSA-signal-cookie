import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LOCAL_STORAGE } from './core/services/local-storage/local-storage.service';
import { CoreModule } from './core/core.module';
import { AuthService } from './core/services/auth-service/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CoreModule],
  providers: [AuthService, { provide: LOCAL_STORAGE, useFactory: () => window.localStorage }],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
