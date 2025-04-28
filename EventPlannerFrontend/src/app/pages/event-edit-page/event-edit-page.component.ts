import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
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
import { response } from 'express';
import { RouterLink } from '@angular/router';
import { LoadingBoxComponent } from '../../components/loading-box/loading-box.component';
import { LoadingFailedBoxComponent } from '../../components/loading-failed-box/loading-failed-box.component';


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
    RouterLink,
    LoadingBoxComponent,
    LoadingFailedBoxComponent
  ],
  templateUrl: './event-edit-page.component.html',
  styleUrl: './event-edit-page.component.scss'
})
export class EventEditPageComponent implements OnInit {
  eventForm!: FormGroup;
  previewImage = '';
  standardImages = [
    '/auswahl/hochzeit.jpg',
    '/auswahl/geburtstag.avif',
    '/auswahl/jugendweihe.jpg',
  ];
  isLoaded = true;
  isFailed = false;


  // Beispielhafte Eventdaten zum Testen
  sampleEvent = {
    title: 'Geburtstagsfeier',
    date: '2025-05-10',
    timeOption: 'start_endzeit',
    startTime: '18:00',
    endTime: '23:00',
    street: 'Musterstraße 12',
    city: 'Musterstadt',
    postalCode: '12345',
    description: 'Eine tolle Party mit Freunden!',
    image: '/auswahl/hochzeit.jpg',
    guestCount: 20,
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
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
      guestCount: [this.sampleEvent.guestCount, Validators.required],
    });

    // Nur setzen, wenn das Bild nicht in den Standardbildern ist
  if (!this.standardImages.includes(this.sampleEvent.image)) {
    this.previewImage = this.sampleEvent.image;
  } else {
    this.previewImage = ''; // kein extra Bild anzeigen
  }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
        this.eventForm.patchValue({ image: this.previewImage });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.eventForm.valid) {
      console.log('Bearbeitetes Event:', this.eventForm.value);
      // hier würde man später ein API-Update machen
    }
  }
}
