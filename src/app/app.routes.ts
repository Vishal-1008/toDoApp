import { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { CreateNewTodoComponent } from './components/create-new-todo/create-new-todo.component';
import { RecentComponent } from './components/recent/recent.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { loginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    // redirectTo: 'login',
    // pathMatch: 'full',
  },
  {
    path: 'about',
    // component: AboutComponent,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/about/about.component').then(
        (m) => m.AboutComponent,
      )
  },
  {
    path: 'contact',
    // component: ContactComponent,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/contact/contact.component').then(
        (m) => m.ContactComponent,
      )
  },
  {
    path: 'add/:type',
    // component: CreateNewTodoComponent,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/create-new-todo/create-new-todo.component').then(
        (m) => m.CreateNewTodoComponent,
      )
  },
  {
    path: 'login',
    // component: LoginComponent,
    canActivate: [loginGuard],
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent,
      )
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
