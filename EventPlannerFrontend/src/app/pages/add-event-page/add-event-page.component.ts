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
    MatIcon,
    SurveyQuestionBoxComponent
  ],
  templateUrl: './add-event-page.component.html',
  styleUrl: './add-event-page.component.scss'
})

export class AddEventPageComponent implements OnInit {
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
      survey: this.fb.array([]),
    });

    // Uhrzeit validieren
    this.eventForm.get('timeOption')?.valueChanges.subscribe((value) => {
      if (value === 'ganztags') {
        this.eventForm.get('startTime')?.clearValidators();
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
  // Getter für das FormArray
  get survey(): FormArray {
    return this.eventForm.get('survey') as FormArray;
  }

  addQuestion() {
    const questionGroup = this.fb.group({
      question: ['', Validators.required],
      answerType: ['multiple', Validators.required],
      answers: this.fb.array([]),
      multipleSelection: [false] // Standardmäßig false
    });
  
    // Füge eine leere Antwort für Multiple Choice hinzu
    const answersArray = questionGroup.get('answers') as FormArray;
    answersArray.push(this.fb.control('', Validators.required));
    
    this.survey.push(questionGroup);
  }
  

  // Antwortmöglichkeit zu einer Frage hinzufügen
  addAnswer(questionIndex: number) {
    const answers = this.getAnswers(this.survey.at(questionIndex));
    answers.push(this.fb.control('', Validators.required));
  }
  

  // Frage entfernen
  removeQuestion(index: number) {
    this.survey.removeAt(index);
  }

  // Antwortmöglichkeit entfernen
  removeAnswer(questionIndex: number, answerIndex: number) {
    const answers = this.survey.at(questionIndex).get('answers') as FormArray;
    answers.removeAt(answerIndex);
  }

  getAnswers(question: AbstractControl | null): FormArray {
    return question?.get('answers') as FormArray;
  }
  
  private transformEventData(surveyId: number) {
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
      street: formData.street,
      city: formData.city,
      postal_code: formData.postalCode,
    };

    //Image setzten !Achtung custom images werden noch nicht berücksichtigt!
    const imageURL = formData.image;

    return {
      title: formData.title,
      description: formData.description,
      venue: eventVenue,
      startdate: startdate,
      enddate: enddate,
      max_guests: formData.guestCount,
      image: imageURL,
      survey_id: surveyId,
    }
  }

  private transfromSurveyData() {
    const fromData = this.eventForm.value;
  
    const survey = {
      title: `Umfrage für ${fromData.title}`,
      description: 'Event-Umfrage',
      questions: fromData.survey.map((q: any) => {
        if (q.answerType === 'multiple') {
          return {
            question: q.question,
            answerType: 'multiple',
            answers: q.answers,
            multipleSelection: q.multipleSelection || false // Verwende den tatsächlichen Wert
          };
        } else if (q.answerType === 'scale') {
          return {
            question: q.question,
            answerType: 'scale',
            answers: [],
            minValue: 1,
            maxValue: 5
          };
        } else if (q.answerType === 'open') {
          return {
            question: q.question,
            answerType: 'open',
            answers: [],
            maxLength: 500
          };
        }
        return {
          question: q.question,
          answerType: q.answerType,
          answers: []
        };
      })
    };
  
    console.log(survey);
    return survey;
  }

  saveEvent(){
    let surveyId = -1;
    this.apiService.createSurvey(this.transfromSurveyData()).subscribe({
      next: (surveyResponse) => {
        console.log(surveyResponse);
        surveyId = surveyResponse.survey_id;
        console.log(this.transformEventData(surveyId));

        this.apiService.createEvent(this.transformEventData(surveyId)).subscribe({ 
          next: (response) => {
            console.log('Event saved successfully', response);
            this.router.navigate(['/landing-page']);
          }, error: (error) => {
            console.log('Saving Event Failed', error);
          }
        });
      }, error: (error) => {
        console.log('Saving survey failed', error);
      }
    });
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.saveEvent();
    }
  }

  get surveyFormGroups(): FormGroup[] {
  return this.survey.controls as FormGroup[];
}

onQuestionTypeChange(index: number) {
  const questionGroup = (this.eventForm.get('survey') as FormArray).at(index) as FormGroup;
  const answerType = questionGroup.get('answerType')?.value;
  const answersArray = questionGroup.get('answers') as FormArray;
  
  if (answerType === 'multiple') {
    // Multiple Choice benötigt mindestens eine Antwort
    if (answersArray.length === 0) {
      answersArray.push(this.fb.control('', Validators.required));
    }
  } else {
    // Für andere Fragetypen keine Antworten erforderlich
    answersArray.clear();
  }
}

ngOnInit() {
  // Leer lassen, aber die Methode muss vorhanden sein wegen OnInit Interface
}

}