import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-detail-box',
  imports: [ MatIconModule, MatDividerModule, MatButtonModule, RouterLink],
  templateUrl: './event-detail-box.component.html',
  styleUrl: './event-detail-box.component.scss'
})
export class EventDetailBoxComponent implements OnInit{
  event: any;

  constructor(private route: ActivatedRoute, private apiService:ApiService, private router: Router) {}

  ngOnInit(): void {
      const eventId = this.route.snapshot.paramMap.get('id');
      if(eventId) {
        this.apiService.getEventById(eventId).subscribe((data) => {
          console.log(data);
          this.event = data;
        }, (error) => {
          console.error('Error fetching event details', error);
        });
      }
  }

  deleteEvent(eventId: number){
    const eventIdString = eventId + '';
    this.apiService.deleteEvent(eventIdString).subscribe((response) => {
      console.log('Event deleted succesfully', response);
    }, (error) => {
      console.log('Deleting Event Failed', error);
    });

    this.router.navigate(['/landing-page']);
  }
}
