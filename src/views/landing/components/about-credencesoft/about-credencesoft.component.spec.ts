/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AboutCredencesoftComponent } from './about-credencesoft.component';

describe('AboutCredencesoftComponent', () => {
  let component: AboutCredencesoftComponent;
  let fixture: ComponentFixture<AboutCredencesoftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutCredencesoftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutCredencesoftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
