import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { QrDialogComponent } from '../../components/qr-dialog/qr-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-qr-event-page',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    RouterLink,
    

  ],
  templateUrl: './qr-event-page.component.html',
  styleUrl: './qr-event-page.component.scss'
})
export class QrEventPageComponent implements OnInit {
  attending: 'yes' | 'no' | null = null;
  surveyAvailable = false;
  surveyId: string | null = null;
  responseSubmitted = false;
  responseMessage = '';
  eventId: any;
  token: any;
  event: any;

  constructor(private apiService: ApiService, private route: ActivatedRoute, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log('Event ID:', this.eventId);
    console.log('Token:', this.token);
      this.apiService.getEventFromQrCode(this.eventId!, this.token).subscribe((eventData) => {
        this.event = eventData;
        console.log('Event fetched successfully: ', this.event);
      }, (error) => {
        console.error('Error fetching Event', error);
      })
  }

  guest = {
    firstname: '',
    lastname: '',
    mail: '',
    info: '',
    password: ''
  };

  event = {
    title: '',
    date: '',
    image: '',
    street: '',
    zip: '',
    city: '',
    info: ''
  };
  
  submitWithPassword(result: any, type: string, confirmation: number) {
    const userData = {
      firstname: result.firstname,
      lastname: result.lastname,
      email: result.mail,
      password: result.password
    }

    this.apiService.register(userData).subscribe((response) => {
      console.log('registration successfull', response);
      this.apiService.login(userData).subscribe((response) => {
        console.log('Login successfull', response);
        localStorage.setItem('token', response.token);
        const guestData = {
          type: type,
          confirmation: confirmation,
          guest: ''
        }
        this.apiService.addGuestToEvent(guestData, this.eventId).subscribe((response) => {
          console.log('Answer submitted...', response);
        }, (error) => {
          console.error('Error while submitting answer...', error);
        });
      }, (error) => {
        console.log('Login failed', error);
      });
    }, (error) => {
      console.log('Registration failed', error);
      this.apiService.login(userData).subscribe((response) => {
        console.log('Login successfull', response);
        localStorage.setItem('token', response.token);
        const guestData = {
          type: type,
          confirmation: confirmation,
          guest: ''
        }
        this.apiService.addGuestToEvent(guestData, this.eventId).subscribe((response) => {
          console.log('Answer submitted...', response);
        }, (error) => {
          console.error('Error while submitting answer...', error);
        });
      }, (error) => {
        console.log('Login failed', error);
      });
    });
  }

  submitWithoutPassword(result: any, type: string, confirmation: number) {
    const guestData = {
      type: type,
      
      //consfirmation: confirmation,
      guest: {
        firstname: result.firstname,
        lastname: result.lastname
      }
    }

    this.apiService.addGuestToEvent(guestData, this.eventId).subscribe({
      next: (res) => {
        console.log('Answer submitted... ', res);
      }, error: (error) => {
        console.log('Error while submitting Data...', error);
      }
    });
  }

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Hole Event-ID und Token aus der URL
    this.route.params.subscribe(params => {
      const eventId = params['id'];
      this.route.queryParams.subscribe(queryParams => {
        const token = queryParams['token'];
        if (eventId && token) {
          this.loadEvent(eventId, token);
        }
      });
    });
  }

  loadEvent(eventId: string, token: string) {
    this.apiService.getPublicEvent(eventId, token).subscribe({
      next: (eventData) => {
        this.event = {
          title: eventData.title,
          date: eventData.startdate,
          image: eventData.image || '/auswahl/hochzeit.jpg',
          street: eventData.street || '',
          zip: eventData.zip || '',
          city: eventData.city || '',
          info: eventData.description
        };

        if (eventData.survey_id) {
          this.surveyAvailable = true;
          this.surveyId = eventData.survey_id;
        }
      },
      error: (error) => {
        console.error('Error loading event:', error);
      }
    });
  }

  submitResponse() {
    const isYes = this.attending === 'yes';
    const message = isYes ? 'Du hast erfolgreich zugesagt!' : 'Deine Absage wurde erfolgreich zugeschickt.';
  
    if (this.attending === 'yes') {
      if(this.guest.password === ''){
        this.submitWithoutPassword(this.guest, 'extra', 1);
        console.log('Zusage:', this.guest);
      } else {
        this.submitWithPassword(this.guest, 'user', 1);
        console.log('Zusage:', this.guest);
      }
      this.responseMessage = 'Du hast erfolgreich zugesagt!';
    } else if (this.attending === 'no') {
      this.submitWithPassword(this.guest, 'user', 0);
      console.log('Absage');
      this.responseMessage = 'Deine Absage wurde gespeichert.';
    }
    this.responseSubmitted = true;

    this.dialog.open(QrDialogComponent, {
      data: {
        title: isYes ? '🎉 Zusage gespeichert' : '❌ Absage gespeichert',
        message: message,
        attending: this.attending,
        surveyAvailable: this.surveyAvailable
      }
    });
  }
  
}