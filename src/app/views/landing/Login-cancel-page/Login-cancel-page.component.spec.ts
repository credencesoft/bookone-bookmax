/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LoginCancelPageComponent } from './Login-cancel-page.component';

describe('LoginCancelPageComponent', () => {
  let component: LoginCancelPageComponent;
  let fixture: ComponentFixture<LoginCancelPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginCancelPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginCancelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
