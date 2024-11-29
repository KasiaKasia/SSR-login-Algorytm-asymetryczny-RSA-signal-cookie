import { Routes } from '@angular/router';
import { LoginComponent } from './core/components/login/login.component';
import { HomeComponent } from './shared/components/home/home.component';
import { canLoadGuard } from './core/guards/can-load.guard';


export const routes: Routes = [{
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
},
{ path: 'login', component: LoginComponent },//, canActivate: [canActiveGuard] 
{ path: 'home', component: HomeComponent, },//, 
{
    path: 'can-load',
    loadChildren: () => import('./can-load/can-load.module').then(m => m.CanLoadModule),
    canLoad: [canLoadGuard]
},
{
    path: 'can-activate',
    loadChildren: () => import('./can-activate/can-activate.module').then(m => m.CanActivateModule)
},
];
