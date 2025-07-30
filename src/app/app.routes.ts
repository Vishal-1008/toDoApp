import { Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { HomeComponent } from './components/home/home.component';
import { NavComponent } from './components/nav/nav.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { CreateNewTodoComponent } from './components/create-new-todo/create-new-todo.component';
import { RecentComponent } from './components/recent/recent.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
       },
    {
    path: "about",
    component: AboutComponent
   },
   {
    path: "contact",
    component: ContactComponent
   },  
   {
    path: "new-todo",
    component: CreateNewTodoComponent
   }, 
   {
    path: "**",
    component: PageNotFoundComponent
   }
];
