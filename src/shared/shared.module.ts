import { LandingLayoutComponent } from './components/layouts/landing-layout/landing-layout.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';



import { AuthLayoutComponent } from './components/layouts/auth-layout/auth-layout.component';



import { ScrollToDirective } from './directives/scroll-to.directive';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderListingdetailsoneComponent } from 'src/app/views/landing/Header-Listingdetailsone/Header-Listingdetailsone.component';



// Add the import at the top

const exportedClasses = [
  AuthLayoutComponent,
  ScrollToDirective,
  LandingLayoutComponent,
  HeaderListingdetailsoneComponent, // <--- Add this here!

];

@NgModule({
  // Note: Since these are standalone, they MUST be in 'imports'
  // and 'exports' of the Module to be shared.
  imports: [
    CommonModule,
    NgbModule,
    RouterModule,
  ],
  exports: [

    CommonModule, // Exporting these saves you from importing them in every component
    NgbModule,
    RouterModule
  ]
})
export class SharedModule {}
