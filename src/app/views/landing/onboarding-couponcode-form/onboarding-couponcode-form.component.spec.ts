import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingCouponcodeFormComponent } from './onboarding-couponcode-form.component';

describe('OnboardingCouponcodeFormComponent', () => {
  let component: OnboardingCouponcodeFormComponent;
  let fixture: ComponentFixture<OnboardingCouponcodeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingCouponcodeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingCouponcodeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
