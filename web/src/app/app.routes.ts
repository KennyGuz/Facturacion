import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { NotFoundComponent } from './not-found-component/not-found-component';
import { Forgotpassword } from './forgotpassword/forgotpassword';
import { Recover } from './recover/recover';
import { MainLayout } from './main-layout/main-layout';
import { Loginform } from './loginform/loginform';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',  // el redirect va en su propio objeto
    pathMatch: 'full',
  },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'login', component: Loginform },
      { path: 'forgotpassword', component: Forgotpassword },
      { path: 'recover', component: Recover }
    ],
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];
