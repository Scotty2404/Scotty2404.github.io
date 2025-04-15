import { Component, OnInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-event-detail-box',
  imports: [ MatIconModule, MatDividerModule, MatButtonModule, RouterLink],
  templateUrl: './event-detail-box.component.html',
  styleUrl: './event-detail-box.component.scss'
})
export class EventDetailBoxComponent implements OnInit{
  event: any;

  constructor(private route: ActivatedRoute, private apiService:ApiService) {}

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
}
