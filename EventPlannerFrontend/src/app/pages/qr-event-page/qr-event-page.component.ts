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
  isLoggedIn = false;
  currentUser: any = null;

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
    // Check if user is already logged in
    this.checkLoginStatus();
    
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

  checkLoginStatus() {
    // Check if there's a token in localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      this.isLoggedIn = true;
      
      // Get user data if logged in
      this.apiService.getUser().subscribe({
        next: (userData) => {
          this.currentUser = userData;
          
          // Pre-fill the form with user data
          this.guestForm.patchValue({
            firstname: userData.firstname,
            lastname: userData.lastname,
            mail: userData.email
          });
          
          // Disable the fields that should not be editable when logged in
          this.guestForm.get('firstname')?.disable();
          this.guestForm.get('lastname')?.disable();
          this.guestForm.get('mail')?.disable();
          
          // Remove password field as it's not needed
          this.guestForm.removeControl('password');
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
          this.isLoggedIn = false;
          // If there was an error, the token might be invalid
          localStorage.removeItem('token');
        }
      });
    }
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
    
    // If user is not logged in, validate all fields
    if (!this.isLoggedIn && !this.guestForm.valid) {
      this.dialog.open(ErrorDialogComponent, {
        data: { message: 'Bitte fülle alle erforderlichen Felder korrekt aus (Vorname, Nachname und Email).' }
      });
      return;
    }
    
    // If user is logged in, only validate info field
    if (this.isLoggedIn && this.guestForm.get('info')?.invalid) {
      this.dialog.open(ErrorDialogComponent, {
        data: { message: 'Bitte überprüfe deine Eingabe im Infofeld.' }
      });
      return;
    }

    const isYes = this.attending === 'yes';
    const message = isYes ? 'Du hast erfolgreich zugesagt!' : 'Deine Absage wurde erfolgreich zugeschickt.';
    const formValues = this.isLoggedIn ? 
      {
        firstname: this.currentUser.firstname,
        lastname: this.currentUser.lastname,
        mail: this.currentUser.email,
        info: this.guestForm.get('info')?.value
      } : 
      this.guestForm.value;
  
    if (this.attending === 'yes') {
      if (this.isLoggedIn) {
        // User is already logged in, just add to event
        this.addLoggedInUserToEvent('user', 1, formValues.info);
      } else if (formValues.password === '') {
        this.submitWithoutPassword(formValues, 'user', 1);
      } else {
        this.submitWithPassword(formValues, 'user', 1);
      }
      this.responseMessage = 'Du hast erfolgreich zugesagt!';
    } else if (this.attending === 'no') {
      if (this.isLoggedIn) {
        // User is already logged in, just add to event
        this.addLoggedInUserToEvent('user', 0, formValues.info);
      } else if (formValues.password === '') {
        this.submitWithoutPassword(formValues, 'user', 0);
      } else {
        this.submitWithPassword(formValues, 'user', 0);
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

// Add already logged in user to event
addLoggedInUserToEvent(type: string, confirmation: number, info: string = '') {
  const guestData = {
    type: type,
    confirmation: confirmation,
    guest: {
      info: info
    }
  };
  
  this.apiService.addGuestToEvent(guestData, this.eventId).subscribe({
    next: (response) => {
      console.log('Answer submitted for logged in user...', response);
      this.responseSubmitted = true;
    },
    error: (error) => {
      console.error('Error while submitting answer...', error);
      
      // Check if error is because user is already registered
      if (error.status === 400 && 
         (error.error?.message?.includes('already exists') || 
          error.error?.message?.includes('User already'))) {
        
        this.dialog.open(ErrorDialogComponent, {
          data: { message: 'Du bist bereits für dieses Event angemeldet. Deine Antwort wurde aktualisiert.' }
        });
        
        // Still consider it submitted since the user is already registered
        this.responseSubmitted = true;
        
      } else {
        // For other errors, show generic error message
        this.dialog.open(ErrorDialogComponent, {
          data: { message: 'Fehler beim Speichern der Antwort. Bitte versuche es später noch einmal.' }
        });
      }
    }
  });
}

  private generateRandomPassword(length: number = 20): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  submitWithoutPassword(result: any, type: string, confirmation: number) {
    console.log('Form values before submission:', result);
    
    // Generate a random password
    const randomPassword = this.generateRandomPassword();
    console.log('Generated random password for auto-registration');
    
    // Register and login the user with the random password
    const userData = {
      firstname: result.firstname,
      lastname: result.lastname,
      email: result.mail || result.email,
      password: randomPassword
    };
    
    // Try to register the user first
    this.apiService.register(userData).subscribe({
      next: (response) => {
        console.log('Auto-registration successful with random password', response);
        // After successful registration, login the user
        this.loginUserAndAddToEvent(userData, type, confirmation, result.info);
      },
      error: (error) => {
        // If registration fails (likely because user already exists), try to login directly
        console.log('Auto-registration failed, trying login', error);
        this.loginUserAndAddToEvent(userData, type, confirmation, result.info);
      }
    });
  }

  // New helper method for login and adding to event
  private loginUserAndAddToEvent(userData: any, type: string, confirmation: number, info: string = '') {
    this.apiService.login(userData).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        // Store the token
        localStorage.setItem('token', response.token);
        
        // Add user to event
        const guestData = {
          type: type,
          confirmation: confirmation,
          guest: {
            info: info
          }
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
        // As a last resort, submit as guest with the original guest structure
        const guestData = {
          type: 'extra',
          confirmation: confirmation,
          guest: {
            firstname: userData.firstname,
            lastname: userData.lastname,
            mail: userData.email,
            info: info
          }
        };
        
        this.apiService.addGuestToEvent(guestData, this.eventId).subscribe({
          next: (res) => {
            console.log('Answer submitted as guest... ', res);
          }, 
          error: (error) => {
            console.log('Error while submitting data...', error);
            this.dialog.open(ErrorDialogComponent, {
              data: { message: 'Fehler beim Speichern der Antwort. Bitte versuche es später noch einmal.' }
            });
          }
        });
      }
    });
  }

  submitWithPassword(result: any, type: string, confirmation: number) {
    const userData = {
      firstname: result.firstname,
      lastname: result.lastname,
      email: result.mail || result.email,
      password: result.password
    };

    this.apiService.register(userData).subscribe({
      next: (response) => {
        console.log('registration successful', response);
        this.loginUserAndAddToEvent(userData, type, confirmation, result.info);
      }, 
      error: (error) => {
        console.log('Registration failed', error);
        // Try logging in if registration fails
        this.loginUserAndAddToEvent(userData, type, confirmation, result.info);
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