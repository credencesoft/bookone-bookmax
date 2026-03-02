// import { CheckoutModule } from 'paytm-blink-checkout-angular';
import { CheckoutComponent } from './views/landing/checkout/checkout.component';
import { BrowserModule, Title, TransferState } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutes, AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { TransferHttpCacheModule } from '@nguniversal/common';

import {
  WpApiModule,
  WpApiLoader,
  WpApiStaticLoader
} from 'wp-api-angular';
import { AgmCoreModule } from '@agm/core';
import { NgSelectModule } from '@ng-select/ng-select';
export function WpApiLoaderFactory(http: Http) {
  return new WpApiStaticLoader(http, 'https://blog.bookonepms.com/wp-json/wp/v2/', '');
}
import { CookieLawModule } from 'angular2-cookie-law';
import { LocationStrategy, HashLocationStrategy, PathLocationStrategy } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { TokenStorage } from 'src/token.storage';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material';
@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,

    SharedModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SlickCarouselModule,
    NgSelectModule,

    NgbModule,
    MatTableModule,
    GooglePlaceModule,
    AgmCoreModule.forRoot({
      apiKey: environment.googleKey
    }),
    TransferHttpCacheModule,
    AppRoutingModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    RouterModule.forRoot(AppRoutes,{ scrollPositionRestoration: 'enabled' }),
    WpApiModule.forRoot({ // <---
      provide: WpApiLoader,
      useFactory: (WpApiLoaderFactory),
      deps: [ Http ]
    }),
    CookieLawModule
  ],
  providers: [
    Title,
    AuthService,
TokenStorage,
    {provide: LocationStrategy, useClass: PathLocationStrategy},
  ],
  bootstrap: [AppComponent]
})

export class AppModule {

}
