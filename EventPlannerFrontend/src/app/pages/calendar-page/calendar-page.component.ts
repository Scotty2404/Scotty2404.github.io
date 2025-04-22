import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCard } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCalendar } from '@angular/material/datepicker'; 

interface EventItem {
  title: string;
  date: Date;
  type: 'zugesagt' | 'selbst';
}

@Component({
  selector: 'app-calendar-page',
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatCard,
    MatListModule,
    MatIconModule,
    MatCalendar,
    
  ],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss'
})
export class CalendarPageComponent {
  selectedDate = new Date();

  events: EventItem[] = [
    {
      title: 'Geburtstag Oma',
      date: new Date('2025-04-25'),
      type: 'zugesagt'
    },
    {
      title: 'Meine Hochzeit',
      date: new Date('2025-04-27'),
      type: 'selbst'
    }
  ];

  getEventsForSelectedDate(): EventItem[] {
    return this.events.filter(event =>
      event.date.toDateString() === this.selectedDate.toDateString()
    );
  }

  getColor(type: 'zugesagt' | 'selbst'): string {
    return type === 'zugesagt' ? '#4CAF50' : '#2196F3';
  }
}