import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestTableDialogComponent } from './guest-table-dialog.component';

describe('GuestTableDialogComponent', () => {
  let component: GuestTableDialogComponent;
  let fixture: ComponentFixture<GuestTableDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuestTableDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestTableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
