import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutes, AppRoutingModule } from './app-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { SharedModule } from './shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgmCoreModule } from '@agm/core';
import { WpApiModule, WpApiLoader, WpApiLoaderFactory } from 'wp-api-angular';
import { CookieLawModule } from 'angular2-cookie-law';
import { environment } from '../environments/environment';
import { Title } from '@angular/platform-browser';
// import { AuthService } from './services/auth.service';
// import { TokenStorage } from './services/token-storage.service';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { TokenStorage } from 'src/token.storage';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,                   // ✅ Standalone BrowserModule
    CommonModule,
    CalendarModule,
    SharedModule,
    NgSelectModule,
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleKey
    }),
    AppRoutingModule,
    RouterModule.forRoot(AppRoutes, { scrollPositionRestoration: 'enabled' }),
    WpApiModule.forRoot({
      provide: WpApiLoader,
      useFactory: WpApiLoaderFactory,
      deps: [HttpClientModule]        // ✅ Replace Http with HttpClientModule
    }),
    CookieLawModule
  ],
  providers: [
    Title,
    AuthService,
    TokenStorage,
    { provide: LocationStrategy, useClass: PathLocationStrategy },
    provideClientHydration(),         // ✅ NEW SSR hydration
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
