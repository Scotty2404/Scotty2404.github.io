import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrEventPageComponent } from './qr-event-page.component';

describe('QrEventPageComponent', () => {
  let component: QrEventPageComponent;
  let fixture: ComponentFixture<QrEventPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrEventPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrEventPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
