import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, AbstractControl, FormControl } from '@angular/forms';

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
import { SurveyQuestionBoxComponent } from '../../components/survey-question-box/survey-question-box.component';
import { RouterLink } from '@angular/router';
import { LoadingBoxComponent } from '../../components/loading-box/loading-box.component';
import { LoadingFailedBoxComponent } from '../../components/loading-failed-box/loading-failed-box.component';


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
    SurveyQuestionBoxComponent,
    RouterLink,
    LoadingBoxComponent,
    LoadingFailedBoxComponent
  ],
  templateUrl: './add-event-page.component.html',
  styleUrl: './add-event-page.component.scss'
})

export class AddEventPageComponent implements OnInit {
  eventForm: FormGroup;
  selectedFile: File | null = null;
  previewImage: string | null = null;
  isLoaded = true;
  isFailed = false;

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
      image: ['', Validators.required],
      guestCount: ['', Validators.required],
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
    resultData.append('startdate', startdate!);
    resultData.append('enddate', enddate!);
    resultData.append('max_guests', formData.guestCount.toString());
    resultData.append('image', image);
    resultData.append('survey_id', surveyId.toString());

    return resultData;
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
        surveyId = surveyResponse.survey_id;

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
    const questionsValid = this.surveyFormGroups.every((q) => {
      const type = q.get('answerType')?.value;
      const answers = q.get('answers') as FormArray;
    
      if (type === 'text') {
        return true; // Freitextfrage ist immer gültig, keine Antworten nötig
      }
    
      if (type === 'scale') {
        const min = q.get('minValue')?.value;
        const max = q.get('maxValue')?.value;
        return min !== null && max !== null;
      }
    
      return answers.length > 0 && answers.controls.every(a => a.value && a.value.trim() !== '');
    });
    

  if (this.eventForm.valid && questionsValid) {
    this.saveEvent();
  } else {
    console.warn('Formular ungültig oder Fragen nicht korrekt ausgefüllt');
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