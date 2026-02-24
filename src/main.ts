/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { enableProdMode, provideZoneChangeDetection } from '@angular/core';


if (environment.production) {
  enableProdMode();
}
bootstrap();
function bootstrap() {

  document.addEventListener("DOMContentLoaded", () => {
    platformBrowserDynamic()
      .bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
      .catch(err => console.log(err));
  });
}
