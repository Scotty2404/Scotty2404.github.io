import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { SurveyDialogComponent } from "../../components/survey-dialog-box/survey-dialog.component";
import { SurveyQuestionBoxComponent } from "../../components/survey-question-box/survey-question-box.component";
import { Survey } from "../../models/survey.model"; // Importiere das Survey-Interface

@Component({
  selector: 'app-survey-page',
  imports: [RouterModule,
            MatButtonModule,
            MatIcon,
            SurveyQuestionBoxComponent,
  ],
  templateUrl: './survey-page.component.html',
  styleUrls: ['./survey-page.component.scss'],
})
export class SurveyPageComponent implements OnInit {
  surveys: Survey[] = [];

  constructor(private dataService: DataService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.dataService.getSurveyList().subscribe((surveys: Survey[]) => {
      this.surveys = surveys;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SurveyDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.addSurvey(result);
        this.surveys.push(result); // Füge die neue Umfrage zur Liste hinzu
      }
    });
  }
}