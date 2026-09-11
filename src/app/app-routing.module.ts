import { LandingLayoutComponent } from './shared/components/layouts/landing-layout/landing-layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { LandingModule } from './views/landing/landing.module';
import { SessionsModule } from './views/sessions/sessions.module';
export const AppRoutes: Routes  = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: ()=> SessionsModule }
    ]
  },
  {
    path: '',
    component: LandingLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: ()=> LandingModule }

    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
