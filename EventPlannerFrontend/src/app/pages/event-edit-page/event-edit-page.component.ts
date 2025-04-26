import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgModule } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatRadioButton } from '@angular/material/radio';
import { MatIcon } from '@angular/material/icon';
import { SurveyQuestionBoxComponent } from '../../components/survey-question-box/survey-question-box.component';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-event-edit-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatRadioButton,
    MatIcon,
    SurveyQuestionBoxComponent,
    RouterLink
  ],
  templateUrl: './event-edit-page.component.html',
  styleUrl: './event-edit-page.component.scss'
})
export class EventEditPageComponent implements OnInit {
  eventForm!: FormGroup;
  previewImage: string | null = null;
  selectedFile: File | null = null;
  standardImages = [
    '/auswahl/hochzeit.jpg',
    '/auswahl/geburtstag.avif',
    '/auswahl/jugendweihe.jpg',
  ];
  eventId: any;
  event: any;
  sampleEvent: any;
  isLoaded = false;
  isFailed = false;

  constructor(private fb: FormBuilder, private apiService: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.loadEvent();
  }

  loadEvent() {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.apiService.getEventById(this.eventId).subscribe((eventData) => {
      console.log('event fetched successfully: ', eventData);
      this.event = eventData;
      this.sampleEvent = this.transformFormerEventData();
      this.initField();
      this.isLoaded = true;
    }, (error) => {
      console.error('Error fetching event', error);
      this.isFailed = true;
    });
  }

  transformFormerEventData() {
    // Zeit formatieren
    let date;
    let timeOption;
    let startTime;
    let endTime;

    const startdate = new Date(this.event.startdate);
    const enddate = new Date(this.event.enddate);

    if(startdate === enddate) {
      timeOption = 'startzeit';
    } else if (enddate.toLocaleTimeString('de-DE') === '23:59:59') {
      timeOption = 'ganztags';
    } else {
      timeOption = 'start_endzeit';
    }

    startTime = startdate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit'});
    endTime = enddate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit'});
    date = startdate.toDateString();


    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = this.event.image.result; // Bild als Base64 speichern
    };

    return {
      title: this.event.title,
      date: date,
      timeOption: timeOption,
      startTime: startTime,
      endTime: endTime,
      street: this.event.street,
      city: this.event.city,
      postalCode: this.event.postal_code,
      description: this.event.description,
      image: this.previewImage,
      guestCount: this.event.max_guests,
    }
  }

  initField(){
    this.eventForm = this.fb.group({
      title: [this.sampleEvent.title, Validators.required],
      date: [new Date(this.sampleEvent.date), Validators.required],
      timeOption: [this.sampleEvent.timeOption],
      startTime: [this.sampleEvent.startTime],
      endTime: [this.sampleEvent.endTime],
      street: [this.sampleEvent.street, Validators.required],
      city: [this.sampleEvent.city, Validators.required],
      postalCode: [this.sampleEvent.postalCode, Validators.required],
      description: [this.sampleEvent.description, Validators.required],
      image: [this.sampleEvent.image],
      guestCount: [this.sampleEvent.guestCount],
    });

    // Nur setzen, wenn das Bild nicht in den Standardbildern ist
  if (!this.standardImages.includes(this.sampleEvent.image)) {
    this.previewImage = this.sampleEvent.image;
  } else {
    this.previewImage = ''; // kein extra Bild anzeigen
  }
  }

  private transformEventData() {
    const formData = this.eventForm.value;

    let startdate, enddate, eventVenue;

    //Start- und Endzeit setzen
    const eventDate = new Date(formData.date);
    const year = eventDate.getFullYear();
    const month = (eventDate.getMonth() + 1).toString().padStart(2, '0');
    const day = eventDate.getDate().toString().padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;

    if(formData.timeOption === 'ganztags') {
      startdate = `${formattedDate}T00:00:00`;
      enddate = `${formattedDate}T23:59:59`;
    } else if(formData.timeOption === 'startzeit') {
      startdate = `${formattedDate}T${formData.startTime}:00`;
      enddate = `${formattedDate}T23:59:59`;
    } else if (formData.timeOption === 'start_endzeit') {
      startdate = `${formattedDate}T${formData.startTime}:00`;
      enddate = `${formattedDate}T${formData.endTime}:00`;
    }

    //Encoded Adress für google Maps link erzeugen
    const address = `${formData.street}, ${formData.city}, ${formData.postal_code}`;
    const encodedAddress = encodeURIComponent(address);
    const googleMapsLink = `https://www.google.com/maps/place?q=${encodedAddress}`; //no api key for embeded google maps links

    //Venue Setzten
    eventVenue = {
      street: formData.street,
      city: formData.city,
      postal_code: formData.postalCode,
      google_maps_link: googleMapsLink,
    };
    
    //Image setzten !Achtung custom images werden noch nicht berücksichtigt!
    let image;
    this.selectedFile ? image = this.selectedFile : image = formData.image;

    const resultData = new FormData();

    resultData.append('title', formData.title);
    resultData.append('description', formData.description);
    resultData.append('venue', JSON.stringify(eventVenue));
    resultData.append('venue_id', this.event.venue_id);
    resultData.append('startdate', startdate!);
    resultData.append('enddate', enddate!);
    resultData.append('max_guests', formData.guestCount.toString());
    resultData.append('image', image);

    return resultData;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      
      reader.onload = (e: any) => {
        this.previewImage = e.target.result; // Bild als Base64 speichern
        this.eventForm.patchValue({ image: this.previewImage }); // Bild direkt auswählen
      };
      
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.apiService.editEvent(this.transformEventData(), this.eventId).subscribe({
        next: (response) => {
          console.log('Event changed successfully', response);
          this.router.navigate(['/event/' + this.eventId]);
        }, error: (error) => {
          console.log('Edeting event failed', error);
        }
      });
    }
  }
}
