import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventToDoListPageComponent } from './event-to-do-list-page.component';

describe('EventToDoListPageComponent', () => {
  let component: EventToDoListPageComponent;
  let fixture: ComponentFixture<EventToDoListPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventToDoListPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventToDoListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
