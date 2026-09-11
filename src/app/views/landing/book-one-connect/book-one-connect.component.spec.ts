import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookOneConnectComponent } from './book-one-connect.component';

describe('BookOneConnectComponent', () => {
  let component: BookOneConnectComponent;
  let fixture: ComponentFixture<BookOneConnectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookOneConnectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookOneConnectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
