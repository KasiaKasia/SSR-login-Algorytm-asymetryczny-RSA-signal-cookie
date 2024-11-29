import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { BasicFormService } from '../../../shared/services/basic-form.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly basicFormService = inject(BasicFormService);
  protected readonly loginForm = this.basicFormService.createForm()

  login() {
    if (this.loginForm.invalid) return

    const loginDetails: User = {
      email: this.loginForm.getRawValue().email ?? '',
      password: this.loginForm.getRawValue().password ?? '',
    }

    this.authService.login(loginDetails).subscribe(() => {
      this.router.navigate(['/home']);
    });
  }
}
