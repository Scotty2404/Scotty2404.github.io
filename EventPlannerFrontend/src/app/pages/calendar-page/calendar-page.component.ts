import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core'; // Import DateAdapter from correct location
import { MatCard } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCalendar } from '@angular/material/datepicker'; 
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { LoadingFailedBoxComponent } from '../../components/loading-failed-box/loading-failed-box.component';
import { LoadingBoxComponent } from '../../components/loading-box/loading-box.component';

import { ApiService } from '../../services/api.service';

interface EventItem {
  title: string;
  date: Date;
  owner: 1 | 0;
  confirmation: 1| 0;
  startdate: string;
}

@Component({
  selector: 'app-calendar-page',
  standalone: true, // Make sure component is standalone
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
    RouterLink,
    MatButtonModule,
    LoadingBoxComponent,
    LoadingFailedBoxComponent
  ],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss'
})
export class CalendarPageComponent implements OnInit {
  isLoaded = false;
  isFailed = false;
  selectedDate = new Date();
  events: any[] = [];
  
  @ViewChild(MatCalendar) calendar!: MatCalendar<Date>;

  constructor(private apiService: ApiService) {} // Remove DateAdapter injection

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(){
    this.apiService.getInvitedEventsForUser().subscribe({
      next: (data) => {
        this.events.push(...data);
        console.log('Fetching Events successful: ', this.events);
        this.isLoaded = true;
        
        // Force calendar to refresh after loading events
        setTimeout(() => {
          if (this.calendar) {
            this.calendar.updateTodaysDate();
          }
        }, 100);
      }, error: (error) => {
        console.log('Error fetching invited Events: ', error);
        this.isFailed = true;
      }
    });
  }

  getEventsForSelectedDate(): EventItem[] {
    return this.events.filter(event => {
      const eventDate = new Date(event.startdate);
      return eventDate.toDateString() === this.selectedDate.toDateString();
    });
  }

  getColor(owner: 0 | 1 ): string {
    return owner === 1 ? '#4CAF50' : '#2196F3';
  }
  
  // Method to check if a date has events
  hasEvents(date: Date): boolean {
    const dateString = date.toDateString();
    return this.events.some(event => {
      const eventDate = new Date(event.startdate).toDateString();
      return eventDate === dateString;
    });
  }
  
  // Method to get events for a specific date
  getEventsForDate(date: Date): any[] {
    const dateString = date.toDateString();
    return this.events.filter(event => {
      const eventDate = new Date(event.startdate).toDateString();
      return eventDate === dateString;
    });
  }
  
  // This is a callback function for dateClass that will be used in the template
  dateClass = (date: Date): string => {
    if (!this.events || this.events.length === 0) {
      return '';
    }
    
    // Check if there are events for this date
    const events = this.getEventsForDate(date);
    
    if (events.length > 0) {
      // Determine class name based on event type
      const hasOwnEvent = events.some(event => event.owner === 1);
      const hasConfirmedEvent = events.some(event => event.confirmation === 1 && event.owner === 0);
      
      if (hasOwnEvent) return 'own-event-date';
      else if (hasConfirmedEvent) return 'confirmed-event-date';
      else return 'unconfirmed-event-date';
    }
    
    return '';
  }
  
  // Helper method to format time for display
  formatEventTime(startdate: string): string {
    const date = new Date(startdate);
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }
}