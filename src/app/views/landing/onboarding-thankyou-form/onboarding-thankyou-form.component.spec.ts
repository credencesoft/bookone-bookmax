import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingThankyouFormComponent } from './onboarding-thankyou-form.component';

describe('OnboardingThankyouFormComponent', () => {
  let component: OnboardingThankyouFormComponent;
  let fixture: ComponentFixture<OnboardingThankyouFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingThankyouFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingThankyouFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
