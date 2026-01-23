import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionsRoutingModule } from './sessions-routing.module';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ForgotComponent } from './forgot/forgot.component';

@NgModule({
  imports: [
    CommonModule,
    SessionsRoutingModule,

    // ✅ IMPORT standalone components here
    SignupComponent,
    SigninComponent,
    ForgotComponent
  ],
  declarations: []   // ❌ REMOVE declarations
})
export class SessionsModule {}
