import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionsRoutingModule } from './sessions-routing.module';
import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { ForgotComponent } from './forgot/forgot.component';

@NgModule({
  imports: [
    CommonModule,
    SessionsRoutingModule
  ],
  declarations: [SignupComponent, SigninComponent, ForgotComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class SessionsModule { }
