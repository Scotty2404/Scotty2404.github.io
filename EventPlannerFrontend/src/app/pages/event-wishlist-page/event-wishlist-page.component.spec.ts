import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventWishlistPageComponent } from './event-wishlist-page.component';

describe('EventWishlistPageComponent', () => {
  let component: EventWishlistPageComponent;
  let fixture: ComponentFixture<EventWishlistPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventWishlistPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventWishlistPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
