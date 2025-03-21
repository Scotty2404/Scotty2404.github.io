import { Component } from '@angular/core';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButton } from '@angular/material/button';
import { NgFor } from '@angular/common';
import { EventDetailBoxComponent } from '../../components/event-detail-box/event-detail-box.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-event-page',
  imports: [
    MatButton, 
    MatCheckboxModule,
    RouterLink,
    MatButtonModule,
    NgFor,
    EventDetailBoxComponent
  ],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss'
})
export class EventPageComponent {

  isLoaded = true;
  isFailed = false;

}
