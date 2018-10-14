import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsModalComponent } from './contacts-modal.component';

describe('ContactsModalComponent', () => {
  let component: ContactsModalComponent;
  let fixture: ComponentFixture<ContactsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
