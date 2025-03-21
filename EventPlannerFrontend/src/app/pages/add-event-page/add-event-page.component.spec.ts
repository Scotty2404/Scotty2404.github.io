import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEventPageComponent } from './add-event-page.component';

describe('AddEventPageComponent', () => {
  let component: AddEventPageComponent;
  let fixture: ComponentFixture<AddEventPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEventPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEventPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
