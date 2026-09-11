import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutRazorpayComponent } from './checkout-razorpay.component';

describe('CheckoutRazorpayComponent', () => {
  let component: CheckoutRazorpayComponent;
  let fixture: ComponentFixture<CheckoutRazorpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutRazorpayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutRazorpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
