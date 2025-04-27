import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { EventDetailBoxComponent } from '../../components/event-detail-box/event-detail-box.component';
import { LoadingBoxComponent } from '../../components/loading-box/loading-box.component';
import { LoadingFailedBoxComponent } from '../../components/loading-failed-box/loading-failed-box.component';

@Component({
  selector: 'app-event-page',
  imports: [ NgFor, MatButton, MatButtonModule, EventDetailBoxComponent, LoadingBoxComponent, LoadingFailedBoxComponent],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss'
})
export class EventPageComponent {
  isLoaded = true;
  isFailed = false;
}
