import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { EventDetailBoxComponent } from '../../components/event-detail-box/event-detail-box.component';

@Component({
  selector: 'app-event-page',
  imports: [ NgFor, MatButton, MatButtonModule, RouterLink, EventDetailBoxComponent],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss'
})
export class EventPageComponent {
  isLoaded = true;
  isFailed = false;
}
