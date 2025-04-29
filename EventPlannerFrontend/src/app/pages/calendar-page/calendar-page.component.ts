import { Component, OnInit } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
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

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(){
    this.apiService.getInvitedEventsForUser().subscribe({
      next: (data) => {
        this.events.push(...data);
        console.log('Fetching Events successful: ', this.events);
        this.isLoaded = true;
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
}