import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-event-detail-box',
  imports: [ MatIconModule, MatDividerModule, MatButtonModule],
  templateUrl: './event-detail-box.component.html',
  styleUrl: './event-detail-box.component.scss'
})
export class EventDetailBoxComponent {

}
