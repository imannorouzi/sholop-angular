import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableMeetingComponent } from './editable-meeting.component';

describe('EditableMeetingComponent', () => {
  let component: EditableMeetingComponent;
  let fixture: ComponentFixture<EditableMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditableMeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditableMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
