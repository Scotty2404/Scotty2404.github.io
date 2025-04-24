import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-event-detail-box',
  imports: [ MatIconModule, MatDividerModule, MatButtonModule, MatCheckboxModule, MatRadioModule, RouterModule, RouterOutlet, RouterLink],

  templateUrl: './event-detail-box.component.html',
  styleUrl: './event-detail-box.component.scss'
})
export class EventDetailBoxComponent implements OnInit, OnDestroy{
  event: any;
  countdown: String = '';
  private timerSubscription!: Subscription;

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

    this.calculateCountdown();
  }

  calculateCountdown() {
    this.timerSubscription = interval(1000).subscribe(() => {
      const now = new Date().getTime();
      const start = new Date(this.event.startdate).getTime();
      const end = new Date(this.event.enddate).getTime();

      const distance = start - now;
      const running = end - now;

      if(distance < 0) {
        if( running < 0) {
          this.countdown = 'Das Event ist vorbei!';
        } else {
          this.countdown = 'Das Event hat begonnen!';
        }

        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours= Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.countdown = `${days} Tage ${hours} Stunden ${minutes} Minuten ${seconds} Sekunden`;
    });
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

  ngOnDestroy(): void {
      if(this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
  }
}
