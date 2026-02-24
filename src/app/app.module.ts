import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

import { GoogleMapsModule } from '@angular/google-maps';
import { NgSelectModule } from '@ng-select/ng-select';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TokenStorage } from 'src/token.storage';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    CommonModule,
    SharedModule,
    CalendarModule,
    SlickCarouselModule,
    NgSelectModule,
    NgbModule,
    MatTableModule,
    GoogleMapsModule
  ],
  providers: [
    Title,
    AuthService,
    TokenStorage,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi()
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}