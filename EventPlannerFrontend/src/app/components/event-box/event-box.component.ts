import { Component, Input, } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-event-box',
  imports: [
    MatButtonModule,
    RouterLink,
    CommonModule,
  ],
  templateUrl: './event-box.component.html',
  styleUrl: './event-box.component.scss'
})
export class EventBoxComponent {

  

  @Input() eventName: string = '';
  @Input() eventTitle: string = '';
  @Input() eventInfo: string = '';
  @Input() eventTime: string = '';

}
