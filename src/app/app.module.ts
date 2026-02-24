// import { CheckoutModule } from 'paytm-blink-checkout-angular';
import { CheckoutComponent } from './views/landing/checkout/checkout.component';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { Http } from '@angular/http';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

import {
  WpApiModule,
  WpApiLoader,
  WpApiStaticLoader
} from 'wp-api-angular';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgSelectModule } from '@ng-select/ng-select';
export function WpApiLoaderFactory(http: Http) {
  return new WpApiStaticLoader(http, 'https://blog.bookonepms.com/wp-json/wp/v2/', '');
}
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TokenStorage } from 'src/token.storage';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { CalendarModule } from 'primeng/calendar';
@NgModule({ declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [CommonModule,
        CalendarModule,
        SharedModule,
        BrowserAnimationsModule,
        SlickCarouselModule,
        NgSelectModule,
        NgbModule,
        MatTableModule,
        GooglePlaceModule,
        GoogleMapsModule,
        AppRoutingModule,
        BrowserModule,
        WpApiModule.forRoot({
            provide: WpApiLoader,
            useFactory: (WpApiLoaderFactory),
            deps: [Http]
        })], providers: [
        Title,
        AuthService,
        TokenStorage,
        { provide: LocationStrategy, useClass: PathLocationStrategy },
          provideHttpClient(
          withFetch(),
          withInterceptorsFromDi()
  )
    ] })

export class AppModule {

}
