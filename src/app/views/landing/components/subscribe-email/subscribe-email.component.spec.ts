/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SubscribeEmailComponent } from './subscribe-email.component';

describe('SubscribeEmailComponent', () => {
  let component: SubscribeEmailComponent;
  let fixture: ComponentFixture<SubscribeEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribeEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
