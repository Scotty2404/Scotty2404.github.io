import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailBoxComponent } from './event-detail-box.component';

describe('EventDetailBoxComponent', () => {
  let component: EventDetailBoxComponent;
  let fixture: ComponentFixture<EventDetailBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDetailBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
