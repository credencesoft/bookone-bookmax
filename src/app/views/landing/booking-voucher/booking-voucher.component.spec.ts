import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingVoucherComponent } from './booking-voucher.component';

describe('BookingVoucherComponent', () => {
  let component: BookingVoucherComponent;
  let fixture: ComponentFixture<BookingVoucherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingVoucherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingVoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
