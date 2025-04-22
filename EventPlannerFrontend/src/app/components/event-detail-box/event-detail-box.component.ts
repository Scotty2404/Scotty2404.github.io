import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-detail-box',
  imports: [ MatIconModule, MatDividerModule, MatButtonModule, MatCheckboxModule, MatRadioModule, RouterModule, RouterOutlet, RouterLink],
  templateUrl: './event-detail-box.component.html',
  styleUrl: './event-detail-box.component.scss'
})
export class EventDetailBoxComponent {

}
