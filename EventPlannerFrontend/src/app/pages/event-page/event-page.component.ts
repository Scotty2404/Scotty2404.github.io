import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { EventDetailBoxComponent } from '../../components/event-detail-box/event-detail-box.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-event-page',
  imports: [ NgFor, MatButton, MatButtonModule, RouterLink, EventDetailBoxComponent, MatCheckboxModule],

  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss'
})
export class EventPageComponent {
  isLoaded = true;
  isFailed = false;
}
