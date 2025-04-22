import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-calendar-page',
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatCard
  ],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss'
})
export class CalendarPageComponent {
  selectedDate = new Date();

  // Beispielhafte Event-Liste
  events = [
    { date: new Date(2025, 4, 20), type: 'created' },
    { date: new Date(2025, 4, 22), type: 'invited' },
    { date: new Date(2025, 4, 25), type: 'created' },
  ];

  getEventType(date: Date): string | null {
    const found = this.events.find(
      e =>
        e.date.getFullYear() === date.getFullYear() &&
        e.date.getMonth() === date.getMonth() &&
        e.date.getDate() === date.getDate()
      
    );
    return found ? found.type : null;
  }

  dateClass = (d: Date): string => {
    const eventType = this.getEventType(d);
    switch (eventType) {
      case 'created':
        return 'event-created';
      case 'invited':
        return 'event-invited';
      default:
        return '';
    }
  };
  
}
