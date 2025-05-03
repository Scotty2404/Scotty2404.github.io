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
  standalone: true,
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
      description: ['', Validators.required],
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
        this.eventForm.get('endTime')?.clearValidators();
      } else if (value === 'startzeit') {
        this.eventForm.get('startTime')?.setValidators([Validators.required]);
        this.eventForm.get('endTime')?.clearValidators();
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
      multipleSelection: [false], // Standardmäßig false
      minValue: [1], // Default min value for scale questions
      maxValue: [5]  // Default max value for scale questions
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

      //Venue Setzten
      eventVenue = {
        street: formData.street,
        city: formData.city,
        postal_code: formData.postalCode,
        google_maps_link: `https://www.google.com/maps/place/${encodeURIComponent(formData.street + ', ' + formData.postalCode + ' ' + formData.city)}`
      };

      //Image setzten
      let image;
      this.selectedFile ? image = this.selectedFile : image = formData.image;

      const resultData = new FormData();

      resultData.append('title', formData.title);
      resultData.append('description', formData.description);
      resultData.append('venue', JSON.stringify(eventVenue));
      resultData.append('startdate', startdate!);
      resultData.append('enddate', enddate!);
      
      // Gästeanzahl korrekt behandeln
      if (formData.guestCount && formData.guestCount !== '') {
        resultData.append('max_guests', formData.guestCount.toString());
      } else {
        resultData.append('max_guests', '0'); // Standardwert, wenn leer
      }
      
      // Bild korrekt verarbeiten
      if (this.selectedFile) {
        resultData.append('image', this.selectedFile);
      } else if (typeof formData.image === 'string') {
        // Bei vorhandener Bildauswahl: Verwende die URL als String
        const imageUrl = formData.image;
        // Falls ein Standard-Bild aus dem Array verwendet wird
        if (this.standardImages.includes(imageUrl)) {
          resultData.append('image', imageUrl);
        } else {
          // Wenn es ein Base64-String ist (durch FileReader)
          // Konvertiere und sende als File-Objekt
          try {
            const byteString = atob(imageUrl.split(',')[1]);
            const mimeString = imageUrl.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            const file = new File([blob], 'image.png', { type: mimeString });
            resultData.append('image', file);
          } catch (e) {
            console.error('Error converting base64 to file:', e);
            // Fallback: Sende eine Standardbild-URL
            resultData.append('image', this.standardImages[0]);
          }
        }
      } else {
        // Fallback für den Fall, dass kein Bild ausgewählt wurde
        resultData.append('image', this.standardImages[0]);
      }
      
      // Wenn eine Umfrage-ID übergeben wurde und sie > 0 ist, füge survey_id hinzu
      if (surveyId > 0) {
        resultData.append('survey_id', surveyId.toString());
      }
      // Wichtig: Bei surveyId <= 0 wird KEIN survey_id-Parameter hinzugefügt!

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
            minValue: q.minValue || 1, // Use the value from form data
            maxValue: q.maxValue || 5  // Use the value from form data
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
  
    return survey;
  }

  saveEvent(){
    // Falls keine Fragen vorhanden sind, erstelle Event ohne Survey
    if (this.survey.length === 0) {
      // Event ohne Survey erstellen
      this.apiService.createEvent(this.transformEventData(-1)).subscribe({ 
        next: (response) => {
          console.log('Event saved successfully without survey', response);
          this.router.navigate(['/landing-page']);
        }, error: (error) => {
          console.log('Saving Event Failed', error);
        }
      });
      return;
    }
  
    // Falls Fragen vorhanden sind, erstelle Survey und dann Event
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
    console.log('Form Status before validation:', this.eventForm.status);
    console.log('Form Value:', this.eventForm.value);
    
    // Überprüfen, ob Umfragefragen vorhanden sind
    const hasQuestions = this.surveyFormGroups.length > 0;
    
    // Wenn keine Fragen vorhanden sind, überspringen wir die Validierung
    if (!hasQuestions) {
      if (this.eventForm.valid) {
        this.saveEvent();
      } else {
        console.warn('Formular ungültig:', this.getFormValidationErrors());
        alert('Bitte füllen Sie alle erforderlichen Felder aus.');
      }
      return;
    }
    
    // Wenn Fragen vorhanden sind, validieren wir diese
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
      console.log('Formular-Status:', this.eventForm.status);
      console.log('Formular-Fehler:', this.getFormValidationErrors());
      
      if (questionsValid) {
        alert('Bitte füllen Sie alle erforderlichen Felder aus.');
      }
    }
  }

  // Hilfsmethode, um Formularfehler anzuzeigen
  getFormValidationErrors() {
    const errors: {[key: string]: any} = {};
    Object.keys(this.eventForm.controls).forEach(key => {
      const control = this.eventForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
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
    // Stellen Sie sicher, dass alle FormControls korrekt initialisiert sind
    console.log('FormGroup initialisiert:', this.eventForm);
    
    // Setze ein Standardbild, wenn keines ausgewählt ist
    if (!this.eventForm.get('image')?.value) {
      this.eventForm.patchValue({
        image: this.standardImages[0]
      });
    }
  }
}