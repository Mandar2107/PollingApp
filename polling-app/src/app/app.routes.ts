import { Routes } from '@angular/router';
import { Welcome } from './Pages/welcome/welcome';
import { AuthGuard } from './Core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Welcome },

  { path: 'login', loadComponent: () => import('./Pages/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./Pages/Registers/register').then(m => m.RegisterComponent) },
   //{ path: 'auth-slider', loadComponent: () => import('./Pages/auth-slider/auth-slider').then(m => m.AuthSliderComponent) },

  {
    path: 'dashboard',
    loadComponent: () => import('./Pages/dashboard/dashboard').then(m => m.DashboardComponent),
    children: [
      { path: 'home', loadComponent: () => import('./Pages/home/home').then(m => m.HomeComponent) ,  canActivate : [AuthGuard]},
      { path: 'polls', loadComponent: () => import('./Pages/polls/polls').then(m => m.PollsComponent),  canActivate : [AuthGuard] },
      { path: 'profile', loadComponent: () => import('./Pages/profile/profile').then(m => m.ProfileComponent) ,canActivate : [AuthGuard] },
      { path: 'poll-dashboard', loadComponent: () => import('./Pages/poll-dashboard/poll-dashboard').then(m => m.PollDashboardComponent) ,canActivate : [AuthGuard]},
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '' }
];

