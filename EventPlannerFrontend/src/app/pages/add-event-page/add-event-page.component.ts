import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';

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




@Component({
  selector: 'app-add-event-page',
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
    MatIcon
  ],
  templateUrl: './add-event-page.component.html',
  styleUrl: './add-event-page.component.scss'
})
export class AddEventPageComponent {
  eventForm: FormGroup;
  selectedFile: File | null = null;
  previewImage: string | null = null;
  
  
  

  standardImages = [
    '/auswahl/hochzeit.jpg',
    '/auswahl/geburtstag.avif',
    '/auswahl/jugendweihe.jpg',
  ];
  

  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      street: ['', Validators.required], 
      city: ['', Validators.required], 
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      description: ['', Validators.required],
      image: ['', Validators.required],
      guestCount: [''],
      timeOption: ['ganztags', Validators.required],
      startTime: [''],
      endTime: [''],
      
    });

    // Uhrzeit validieren
    this.eventForm.get('timeOption')?.valueChanges.subscribe((value) => {
      if (value === 'ganztags') {
        this.eventForm.get('startTime')?.setValidators([]);
        this.eventForm.get('endTime')?.setValidators([]);
      } else if (value === 'startzeit') {
        this.eventForm.get('startTime')?.setValidators([Validators.required]);
        this.eventForm.get('endTime')?.setValidators([]);
      } else if (value === 'start_endzeit') {
        this.eventForm.get('startTime')?.setValidators([Validators.required]);
        this.eventForm.get('endTime')?.setValidators([Validators.required]);
      }
      this.eventForm.get('startTime')?.updateValueAndValidity();
      this.eventForm.get('endTime')?.updateValueAndValidity();
    });
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

  private transformEventData() {
    const formData = this.eventForm.value;

    let startdate, enddate, eventVenue;

    //Start- und Endzeit setzen
    const eventDate = new Date(formData.date);
    const formattedDate = eventDate.toISOString().split('T')[0];

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

    //Venue Setzten
    eventVenue = {
      street: 'Hans-Grundig-Straße 25',
      city: 'Dresden',
      postal_code: '01307',
    };



    return {
      title: formData.title,
      description: formData.description,
      venue: eventVenue, //Vorläufitge Lösung
      startdate: startdate,
      enddate: enddate,
      max_guests: formData.guestCount,
    }
  }

  saveEvent(){
    console.log(this.transformEventData());
    this.apiService.createEvent(this.transformEventData()).subscribe((response) => {
      console.log('Event saved successfully', response);
    }, (error) => {
      console.log('Saving Event Failed', error);
    })
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.saveEvent();
      this.router.navigate(['/landing-page']);
    }
  }
}

