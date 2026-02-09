import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingConfirmationVoucherComponent } from './booking-confirmation-voucher.component';

describe('BookingConfirmationVoucherComponent', () => {
  let component: BookingConfirmationVoucherComponent;
  let fixture: ComponentFixture<BookingConfirmationVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingConfirmationVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingConfirmationVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
