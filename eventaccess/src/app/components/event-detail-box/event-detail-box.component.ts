import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { EventEditPageComponent } from '../../pages/event-edit-page/event-edit-page.component';

@Component({
  selector: 'app-event-detail-box',
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    RouterLink,
    EventEditPageComponent
  ],
  templateUrl: './event-detail-box.component.html',
  styleUrl: './event-detail-box.component.scss'
})
export class EventDetailBoxComponent {

}
