import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth-service/auth.service';



@NgModule({
  declarations: [],
  imports: [ 
    LoginComponent,
    NavbarComponent
  ],
  exports:[
    LoginComponent,
    NavbarComponent
  ], 
})
export class CoreModule { }
