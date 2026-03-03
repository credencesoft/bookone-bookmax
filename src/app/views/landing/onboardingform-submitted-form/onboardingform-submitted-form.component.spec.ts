import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingformSubmittedFormComponent } from './onboardingform-submitted-form.component';

describe('OnboardingformSubmittedFormComponent', () => {
  let component: OnboardingformSubmittedFormComponent;
  let fixture: ComponentFixture<OnboardingformSubmittedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingformSubmittedFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingformSubmittedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
