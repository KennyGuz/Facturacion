import { Routes } from '@angular/router';
import { authGuard, isloggedGuard } from './guards/auth.guard';
import { MainLayout } from './components/main-layout/main-layout';
import { Loginform } from './components/loginform/loginform';
import { NotFoundComponent } from './components/not-found-component/not-found-component';
import { DashboardLayout } from './components/dashboard-layout/dashboard-layout';
import { Forgotpassword } from './components/forgotpassword/forgotpassword';
import { Recover } from './components/recover/recover';
import { Dashboard } from './components/dashboard/dashboard';
import { Mesas } from './components/mesas/mesas';
import { MesasForm } from './components/mesas-form/mesas-form';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: DashboardLayout,
    canActivate: [isloggedGuard]
  },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'login', component: Loginform, canActivate: [isloggedGuard] },
      { path: 'forgotpassword', component: Forgotpassword, canActivate: [isloggedGuard] },
      { path: 'recover', component: Recover, canActivate: [isloggedGuard] }
    ],
  },
  {
    path: 'dashboard',
    component: DashboardLayout,
    canActivate: [authGuard],
    children: [
      { path: '', component: Dashboard },
      {path: 'mesas', component: Mesas},
      { path: 'mesas/new', component: MesasForm },


    ],
  },
  {
    path: '**',
    component: NotFoundComponent
  },
];
