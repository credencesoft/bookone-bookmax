import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingRoomdetailsFormComponent } from './onboarding-roomdetails-form.component';

describe('OnboardingRoomdetailsFormComponent', () => {
  let component: OnboardingRoomdetailsFormComponent;
  let fixture: ComponentFixture<OnboardingRoomdetailsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnboardingRoomdetailsFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnboardingRoomdetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
