import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { DataService } from '../../services/data.service';
import { SurveyDialogComponent } from '../../components/survey-dialog-box/survey-dialog.component';
import { SurveyQuestionResultBoxComponent } from '../../components/survey-question-result-box/survey-question-result-box.component';
import { Survey } from '../../models/survey.model';
import { MatAccordion } from '@angular/material/expansion';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


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
    MatAccordion
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './survey-page.component.html',
  styleUrls: ['./survey-page.component.scss']
})
export class SurveyPageComponent implements OnInit {
  completedSurveys: Survey[] = [];
  ongoingSurveys: Survey[] = [];

  constructor(private dataService: DataService, private dialog: MatDialog) {}
  panelOpenState = signal(false);

  ngOnInit(): void {
    // For now, don't load from backend
    // this.dataService.getSurveyList().subscribe((surveys: Survey[]) => {
    //   console.log('Surveys loaded:', surveys);
    //   this.ongoingSurveys = surveys; // Or split based on status
    // });

    console.log('Mocked survey data:', this.ongoingSurveys);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SurveyDialogComponent, {
      width: '600px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Assuming the new survey has a "status" field
        console.log('New survey created:', result);

        switch (result.status) {
          case 'ongoing':
            this.ongoingSurveys.push(result);
            break;
          case 'completed':
            this.completedSurveys.push(result);
            break;
          default:
            this.ongoingSurveys.push(result);
        }
      }
    });
  }

  completeSurvey(survey: Survey): void {
    // Setze Status
    survey.status = 'completed';
  
    // Entferne aus ongoingSurveys
    this.ongoingSurveys = this.ongoingSurveys.filter(s => s !== survey);
  
    // Füge zu completedSurveys hinzu
    this.completedSurveys.push(survey);
  }
}