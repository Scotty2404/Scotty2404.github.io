import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestTablePageComponent } from './guest-table-page.component';

describe('GuestTablePageComponent', () => {
  let component: GuestTablePageComponent;
  let fixture: ComponentFixture<GuestTablePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestTablePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestTablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
