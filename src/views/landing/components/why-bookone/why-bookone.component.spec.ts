/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WhyBookoneComponent } from './why-bookone.component';

describe('WhyBookoneComponent', () => {
  let component: WhyBookoneComponent;
  let fixture: ComponentFixture<WhyBookoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WhyBookoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhyBookoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
