import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

// Importing project-internal services, models, and components
import { DataService } from '../../services/data.service';
import { ApiService } from '../../services/api.service';
import { SurveyDialogComponent } from '../../components/survey-dialog-box/survey-dialog.component';
import { SurveyQuestionResultBoxComponent } from '../../components/survey-question-result-box/survey-question-result-box.component';
import { Survey } from '../../models/survey.model';
import { MatAccordion } from '@angular/material/expansion';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LoadingBoxComponent } from '../../components/loading-box/loading-box.component';
import { LoadingFailedBoxComponent } from '../../components/loading-failed-box/loading-failed-box.component';

@Component({
  selector: 'app-survey-page',
  standalone: true,
  imports: [
    RouterModule,
    MatButtonModule,
    MatIcon,
    SurveyQuestionResultBoxComponent,
    MatDialogModule,
    SurveyDialogComponent,
    MatExpansionModule,
    MatAccordion,
    LoadingBoxComponent,
    LoadingFailedBoxComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.Default, // Changed to Default for easier state updates
  templateUrl: './survey-page.component.html',
  styleUrls: ['./survey-page.component.scss']
})
export class SurveyPageComponent implements OnInit {
  completedSurveys: Survey[] = [];
  ongoingSurveys: Survey[] = [];

  isLoaded = false;
  isFailed = false;
  eventId: string | null = null;
  surveyId: string | null = null;

  constructor(
    private dataService: DataService,
    private apiService: ApiService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {}

  // Angular Signal for reactive control of accordion status
  panelOpenState = signal(false);

  ngOnInit(): void {
    // Get the event ID from the route
    this.eventId = this.route.snapshot.paramMap.get('id');
    console.log('Event ID from route:', this.eventId);
    
    if (this.eventId) {
      this.loadEventSurveys(this.eventId);
    } else {
      // If no specific event ID, load all surveys (fallback)
      this.loadAllSurveys();
    }
  }

  loadEventSurveys(eventId: string) {
    this.isLoaded = false;
    this.isFailed = false;

    // First, get event details to find the survey ID
    this.apiService.getEventById(eventId).subscribe({
      next: (eventData) => {
        console.log('Event data:', eventData);
        if (eventData && eventData.survey_id) {
          this.surveyId = eventData.survey_id;
          console.log('Found survey ID:', this.surveyId);
          
          // If the event has an associated survey, fetch it
          this.apiService.getSurvey(eventData.survey_id).subscribe({
            next: (surveyData) => {
              console.log('Survey data:', surveyData);
              if (surveyData && surveyData.data) {
                // Process the survey based on status
                const survey = this.processSurveyData(surveyData.data);
                
                // For demonstration, treat existing surveys as ongoing
                this.ongoingSurveys = [survey];
                
                // Now fetch the results
                this.loadSurveyResults(eventData.survey_id);
              } else {
                console.log('No survey data found');
                this.isLoaded = true; // No data but request succeeded
              }
            },
            error: (error) => {
              console.error('Error loading survey:', error);
              this.isFailed = true;
              this.isLoaded = true;
            }
          });
        } else {
          console.log('No survey ID associated with this event');
          this.isLoaded = true; // No survey associated with the event
        }
      },
      error: (error) => {
        console.error('Error loading event details:', error);
        this.isFailed = true;
        this.isLoaded = true;
      }
    });
  }

  loadSurveyResults(surveyId: string) {
    this.apiService.getSurveyResults(surveyId).subscribe({
      next: (resultsData) => {
        console.log('Survey results:', resultsData);
        if (resultsData && resultsData.data) {
          // Update survey with results data
          this.updateSurveyWithResults(resultsData.data);
        }
        this.isLoaded = true;
      },
      error: (error) => {
        console.error('Error loading survey results:', error);
        this.isLoaded = true;
      }
    });
  }

  loadAllSurveys() {
    // Fallback to load all surveys if no specific event ID
    this.isLoaded = false;
    
    // First try to get surveys from the service
    if (this.dataService.surveyList && this.dataService.surveyList.length > 0) {
      this.ongoingSurveys = this.dataService.surveyList.filter(survey => survey.status === 'ongoing');
      this.completedSurveys = this.dataService.surveyList.filter(survey => survey.status === 'completed');
      this.isLoaded = true;
    } else {
      // If no surveys in the service, try to load sample data
      this.loadSampleSurveys();
    }
  }

  loadSampleSurveys() {
    // Create some sample surveys if needed
    const sampleSurvey: Survey = {
      title: 'Sample Survey',
      questions: [
        {
          text: 'What is your favorite color?',
          answerType: 'checkbox',
          options: ['Red', 'Blue', 'Green', 'Yellow'],
          optionPercentages: [25, 40, 20, 15],
        },
        {
          text: 'How would you rate this event?',
          answerType: 'scale',
          scaleValue: 4,
          answerPercentage: 80
        }
      ],
      status: 'ongoing'
    };
    
    // Add to our list
    this.ongoingSurveys = [sampleSurvey];
    
    // Add to the service for future reference
    this.dataService.addSurvey(sampleSurvey);
    
    this.isLoaded = true;
  }

  processSurveyData(surveyData: any): Survey {
    console.log('Processing survey data:', surveyData);
    
    // Transform API survey data to the Survey model format
    const survey: Survey = {
      title: surveyData.title || 'Unnamed Survey',
      questions: (surveyData.questions || []).map((q: any) => ({
        text: q.questionText,
        answerType: this.mapQuestionType(q.type),
        options: q.options ? q.options.map((o: any) => o.text) : [],
        optionPercentages: q.options ? q.options.map(() => Math.floor(Math.random() * 100)) : [],
        multipleSelection: q.multipleSelection || false,
        scaleValue: q.type === 'scale' ? q.minValue || 1 : undefined,
        answerPercentage: q.type === 'scale' ? Math.floor(Math.random() * 100) : undefined
      })),
      status: 'ongoing' // Default status
    };
    
    console.log('Processed survey:', survey);
    return survey;
  }

  mapQuestionType(type: string): string {
    // Map the backend question types to frontend types
    switch (type) {
      case 'multiple':
        return 'checkbox';
      case 'text':
        return 'open';
      case 'scale':
        return 'scale';
      default:
        return type;
    }
  }

  updateSurveyWithResults(data: any) {
    console.log('Updating survey with results:', data);
    
    // If we received complete survey and results data
    if (data.survey && data.results) {
      const survey = data.survey;
      const results = data.results;
      
      // Update our ongoing surveys with real data
      if (this.ongoingSurveys.length > 0) {
        this.ongoingSurveys[0].title = survey.title || this.ongoingSurveys[0].title;
        
        // Update each question with real results
        survey.questions.forEach((question: any, index: number) => {
          if (index < this.ongoingSurveys[0].questions.length) {
            // Update option percentages from results
            this.updateQuestionResults(this.ongoingSurveys[0].questions[index], question, results);
          }
        });
      }
    }
  }

  updateQuestionResults(question: any, apiQuestion: any, results: any[]) {
    // Calculate result percentages based on the answers
    if (question.answerType === 'checkbox' && apiQuestion.options) {
      // Count responses for each option
      const optionCounts = new Array(apiQuestion.options.length).fill(0);
      let totalResponses = 0;
      
      // Process each response
      results.forEach((response: any) => {
        if (response.answers && response.answers[apiQuestion.id]) {
          const answer = response.answers[apiQuestion.id];
          if (Array.isArray(answer)) {
            // For multiple selection questions
            answer.forEach((ans: any) => {
              const optionIndex = this.findOptionIndex(ans, apiQuestion.options);
              if (optionIndex >= 0) {
                optionCounts[optionIndex]++;
                totalResponses++;
              }
            });
          } else if (typeof answer === 'object') {
            // For single selection
            const optionIndex = this.findOptionIndex(answer, apiQuestion.options);
            if (optionIndex >= 0) {
              optionCounts[optionIndex]++;
              totalResponses++;
            }
          }
        }
      });
      
      // Calculate percentages
      if (totalResponses > 0) {
        question.optionPercentages = optionCounts.map(count => 
          Math.round((count / totalResponses) * 100)
        );
      }
    } else if (question.answerType === 'scale') {
      // Calculate average rating
      let totalScore = 0;
      let count = 0;
      
      results.forEach((response: any) => {
        if (response.answers && response.answers[apiQuestion.id]) {
          const value = response.answers[apiQuestion.id];
          if (typeof value === 'number') {
            totalScore += value;
            count++;
          }
        }
      });
      
      if (count > 0) {
        question.scaleValue = Math.round(totalScore / count);
        question.answerPercentage = Math.round((question.scaleValue / apiQuestion.maxValue) * 100);
      }
    }
  }

  findOptionIndex(answer: any, options: any[]): number {
    // Find the index of the option based on ID or text
    if (answer.optionId !== undefined) {
      return options.findIndex(opt => opt.id === answer.optionId);
    } else if (answer.optionText) {
      return options.findIndex(opt => opt.text === answer.optionText);
    }
    return -1;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SurveyDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('New survey created:', result);

        // If we have an event ID, associate the survey with this event
        if (this.eventId && result) {
          // Prepare survey data for API
          const surveyData = {
            title: result.title || 'Neue Umfrage',
            description: 'Event-Umfrage',
            questions: result.questions.map((q: any) => ({
              question: q.text,
              answerType: this.mapQuestionTypeToBackend(q.answerType),
              answers: q.options || [],
              multipleSelection: q.multipleSelection || false
            }))
          };
          
          // Save the survey via API
          this.apiService.createSurvey(surveyData).subscribe({
            next: (response) => {
              console.log('Survey saved successfully:', response);
              if (response && response.success) {
                // Convert back to our model format
                const newSurvey = this.processSurveyData(response.data);
                this.ongoingSurveys.push(newSurvey);
              }
            },
            error: (error) => {
              console.error('Error saving survey:', error);
            }
          });
        } else {
          // Just add to the local list if no event ID
          this.ongoingSurveys.push(result);
          this.dataService.addSurvey(result);
        }
      }
    });
  }

  mapQuestionTypeToBackend(type: string): string {
    // Map the frontend question types to backend types
    switch (type) {
      case 'checkbox':
        return 'multiple';
      case 'open':
        return 'text';
      case 'scale':
        return 'scale';
      default:
        return type;
    }
  }

  completeSurvey(survey: Survey): void {
    if (this.surveyId) {
      // Mark the survey as completed in the backend
      // This would typically call an API endpoint like PATCH /surveys/{id}/complete
      // Since we don't have this endpoint, we'll simulate it
      this.ongoingSurveys = this.ongoingSurveys.filter(s => s !== survey);
      survey.status = 'completed';
      this.completedSurveys.push(survey);
    } else {
      // Use the mock service for frontend-only operation
      this.dataService.getSurveyResult(survey).subscribe({
        next: (resultSurvey: Survey) => {
          this.ongoingSurveys = this.ongoingSurveys.filter(s => s !== survey);
          this.completedSurveys.push(resultSurvey);
        },
        error: (err) => {
          console.error('Error completing survey:', err);
        }
      });
    }
  }
}