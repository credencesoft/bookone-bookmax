import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaylaterConfirmComponent } from './paylater-confirm.component';

describe('PaylaterConfirmComponent', () => {
  let component: PaylaterConfirmComponent;
  let fixture: ComponentFixture<PaylaterConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaylaterConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaylaterConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
