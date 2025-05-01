import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { QrDialogComponent } from '../../components/qr-dialog/qr-dialog.component';
import { ApiService } from '../../services/api.service';
import { ErrorDialogComponent } from '../../components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-qr-event-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatCardModule,
    RouterLink,
    QrDialogComponent,
    MatDialogModule,
    ErrorDialogComponent
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
  guestForm: FormGroup;
  formSubmitted = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    // Initialize form with validators
    this.guestForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      mail: ['', [Validators.required, Validators.email]],
      info: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
    // Get event ID and token from the URL
    this.route.params.subscribe(params => {
      this.eventId = params['id'];
      this.route.queryParams.subscribe(queryParams => {
        this.token = queryParams['token'];
        if (this.eventId && this.token) {
          this.loadEvent(this.eventId, this.token);
        }
      });
    });
  }

  loadEvent(eventId: string, token: string) {
    this.apiService.getPublicEvent(eventId, token).subscribe({
      next: (eventData) => {
        this.event = {
          title: eventData.title,
          startdate: eventData.startdate,
          enddate: eventData.enddate,
          image: eventData.image || '/auswahl/hochzeit.jpg',
          street: eventData.street || '',
          postalCode: eventData.postalCode || '',
          city: eventData.city || '',
          description: eventData.description
        };

        if (eventData.survey_id) {
          this.surveyAvailable = true;
          this.surveyId = eventData.survey_id;
        }
      },
      error: (error) => {
        console.error('Error loading event:', error);
        this.dialog.open(ErrorDialogComponent, {
          data: { message: 'Fehler beim Laden des Events. Bitte versuche es später noch einmal.' }
        });
      }
    });
  }

  submitResponse() {
    this.formSubmitted = true;
    
    // Check if form is valid
    if (!this.guestForm.valid) {
      this.dialog.open(ErrorDialogComponent, {
        data: { message: 'Bitte fülle alle erforderlichen Felder korrekt aus (Vorname, Nachname und Email).' }
      });
      return;
    }

    const isYes = this.attending === 'yes';
    const message = isYes ? 'Du hast erfolgreich zugesagt!' : 'Deine Absage wurde erfolgreich zugeschickt.';
    const formValues = this.guestForm.value;
  
    if (this.attending === 'yes') {
      if(formValues.password === '') {
        this.submitWithoutPassword(formValues, 'extra', 1);
        console.log('Zusage:', formValues);
      } else {
        this.submitWithPassword(formValues, 'user', 1);
        console.log('Zusage:', formValues);
      }
      this.responseMessage = 'Du hast erfolgreich zugesagt!';
    } else if (this.attending === 'no') {
      if(formValues.password === '') {
        this.submitWithoutPassword(formValues, 'extra', 0);
        console.log('Absage:', formValues);
      } else {
        this.submitWithPassword(formValues, 'user', 0);
        console.log('Absage:', formValues);
      }
      this.responseMessage = 'Deine Absage wurde gespeichert.';
    }
    
    this.responseSubmitted = true;

    this.dialog.open(QrDialogComponent, {
      data: {
        title: isYes ? '🎉 Zusage gespeichert' : '❌ Absage gespeichert',
        message: message,
        attending: this.attending,
        surveyAvailable: this.surveyAvailable,
        surveyID: this.surveyId
      }
    });
  }

  submitWithPassword(result: any, type: string, confirmation: number) {
    const userData = {
      firstname: result.firstname,
      lastname: result.lastname,
      email: result.mail,
      password: result.password
    };

    this.apiService.register(userData).subscribe({
      next: (response) => {
        console.log('registration successful', response);
        this.apiService.login(userData).subscribe({
          next: (response) => {
            console.log('Login successful', response);
            localStorage.setItem('token', response.token);
            const guestData = {
              type: type,
              confirmation: confirmation,
              guest: ''
            };
            this.apiService.addGuestToEvent(guestData, this.eventId).subscribe({
              next: (response) => {
                console.log('Answer submitted...', response);
              }, 
              error: (error) => {
                console.error('Error while submitting answer...', error);
                this.dialog.open(ErrorDialogComponent, {
                  data: { message: 'Fehler beim Speichern der Antwort. Bitte versuche es später noch einmal.' }
                });
              }
            });
          }, 
          error: (error) => {
            console.log('Login failed', error);
            // If login failed, try to add as guest
            this.submitWithoutPassword(result, 'extra', confirmation);
          }
        });
      }, 
      error: (error) => {
        console.log('Registration failed', error);
        this.apiService.login(userData).subscribe({
          next: (response) => {
            console.log('Login successful', response);
            localStorage.setItem('token', response.token);
            const guestData = {
              type: type,
              confirmation: confirmation,
              guest: ''
            };
            this.apiService.addGuestToEvent(guestData, this.eventId).subscribe({
              next: (response) => {
                console.log('Answer submitted...', response);
              }, 
              error: (error) => {
                console.error('Error while submitting answer...', error);
                this.dialog.open(ErrorDialogComponent, {
                  data: { message: 'Fehler beim Speichern der Antwort. Bitte versuche es später noch einmal.' }
                });
              }
            });
          }, 
          error: (error) => {
            console.log('Login failed', error);
            // If login failed, try to add as guest
            this.submitWithoutPassword(result, 'extra', confirmation);
          }
        });
      }
    });
  }

  submitWithoutPassword(result: any, type: string, confirmation: number) {
    console.log('Form values before submission:', result);
    
    const guestData = {
      type: type,
      confirmation: confirmation,
      guest: {
        firstname: result.firstname,
        lastname: result.lastname,
        mail: result.mail,
        info: result.info || ''
      }
    };
  
    console.log('Guest data structure:', guestData);
  
    this.apiService.addGuestToEvent(guestData, this.eventId).subscribe({
      next: (res) => {
        console.log('Answer submitted... ', res);
      }, 
      error: (error) => {
        console.log('Error while submitting Data...', error);
        console.log('Error details:', error.error);
        this.dialog.open(ErrorDialogComponent, {
          data: { message: 'Fehler beim Speichern der Antwort. Bitte versuche es später noch einmal.' }
        });
      }
    });
  }

  // Helper method to check if field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.guestForm.get(fieldName);
    return !!(field && field.invalid && (field.touched || this.formSubmitted));
  }

  // Helper method to get error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.guestForm.get(fieldName);
    
    if (!field) return '';
    
    if (field.hasError('required')) {
      return 'Dieses Feld ist erforderlich';
    }
    
    if (field.hasError('email')) {
      return 'Bitte gib eine gültige E-Mail-Adresse ein';
    }
    
    if (field.hasError('minlength')) {
      return `Mindestens ${field.errors?.['minlength']?.requiredLength} Zeichen erforderlich`;
    }
    
    return '';
  }
}