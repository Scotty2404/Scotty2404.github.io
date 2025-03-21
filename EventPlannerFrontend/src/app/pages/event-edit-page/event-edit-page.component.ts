import { Component } from '@angular/core';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButton } from '@angular/material/button';
import { NgFor } from '@angular/common';
import { EventEditBoxComponent } from '../../components/event-edit-box/event-edit-box.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-event-edit-page',
  imports: [
    MatButton, 
    MatCheckboxModule,
    RouterLink,
    MatButtonModule,
    NgFor,
    EventEditBoxComponent
  ],
  templateUrl: './event-edit-page.component.html',
  styleUrl: './event-edit-page.component.scss'
})
export class EventEditPageComponent {

  isLoaded = true;
  isFailed = false;

}
