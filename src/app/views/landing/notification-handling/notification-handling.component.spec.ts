import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationHandlingComponent } from './notification-handling.component';

describe('NotificationHandlingComponent', () => {
  let component: NotificationHandlingComponent;
  let fixture: ComponentFixture<NotificationHandlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificationHandlingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationHandlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
