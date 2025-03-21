import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-event-edit-box',
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './event-edit-box.component.html',
  styleUrl: './event-edit-box.component.scss'
})
export class EventEditBoxComponent {

}
