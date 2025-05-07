import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventEditBoxComponent } from './event-edit-box.component';

describe('EventEditBoxComponent', () => {
  let component: EventEditBoxComponent;
  let fixture: ComponentFixture<EventEditBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventEditBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventEditBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
