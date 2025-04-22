import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestTableBoxComponent } from './guest-table-box.component';

describe('GuestTableBoxComponent', () => {
  let component: GuestTableBoxComponent;
  let fixture: ComponentFixture<GuestTableBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestTableBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestTableBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
