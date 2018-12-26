import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VenuesModalComponent } from './venues-modal.component';

describe('VenuesModalComponent', () => {
  let component: VenuesModalComponent;
  let fixture: ComponentFixture<VenuesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VenuesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VenuesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
