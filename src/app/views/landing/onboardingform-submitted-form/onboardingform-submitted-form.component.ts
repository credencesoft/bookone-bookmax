import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-onboardingform-submitted-form',
  templateUrl: './onboardingform-submitted-form.component.html',
  styleUrls: ['./onboardingform-submitted-form.component.scss'],
  standalone:true,
  imports:[SharedModule]
})
export class OnboardingformSubmittedFormComponent {
  backgroundColor = 'landing-gradient-purple-indigo';
}
