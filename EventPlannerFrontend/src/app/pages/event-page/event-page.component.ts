import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { EventDetailBoxComponent } from '../../components/event-detail-box/event-detail-box.component';
import { LoadingBoxComponent } from '../../components/loading-box/loading-box.component';
import { LoadingFailedBoxComponent } from '../../components/loading-failed-box/loading-failed-box.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-event-page',
  standalone: true,
  imports: [ 
    NgFor, 
    MatButtonModule, 
    EventDetailBoxComponent, 
    RouterLink, 
    MatCheckboxModule, 
    LoadingBoxComponent, 
    LoadingFailedBoxComponent,
    MatIconModule,
    MatCardModule,
    CommonModule
  ],
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss'
})
export class EventPageComponent implements OnInit {
  isLoaded = false;
  isFailed = false;
  event: any;
  eventTime: any;
  googleMapsUrl: any;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');

    if(eventId) {
      this.apiService.getEventById(eventId).subscribe((eventData: any) => {
        this.event = eventData;
        this.setTimeForEvent();
        this.googleMapsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.event.google_maps_link);
        this.isLoaded = true;
      }, (error: any) => {
        console.error('Error fetching Event details', error);
        this.isFailed = true;
      });
    }
  }

  setTimeForEvent(){
    const start = new Date(this.event.startdate);
    const end = new Date(this.event.enddate);

    if(start === end) {
      this.eventTime = `Am ${start.toLocaleDateString('de-DE')} um ${start.toLocaleTimeString('de-DE')} Uhr`;
    } else {
      this.eventTime = `Vom ${start.toLocaleDateString('de-DE')} um ${start.toLocaleTimeString('de-DE')} Uhr bis zum ${end.toLocaleDateString('de-DE')} um ${end.toLocaleTimeString('de-DE')} Uhr`;
    }

    return;
  }
}