import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { Survey } from '../../models/survey.model';



@Component({
  selector: 'app-survey-question-result-box',
  standalone: true,
  imports: [MatPaginator,
            MatSort,
            CommonModule,
            MatFormFieldModule,
            MatLabel,
            MatIcon,
            MatPaginatorModule,
            MatTableModule,
            MatButtonModule,
            MatCardModule,
            MatTabsModule,
            MatCheckboxModule,
            MatInputModule,
            MatSliderModule,
            MatProgressBarModule,
            MatListModule
  ],
  templateUrl: './survey-question-result-box.component.html',
  styleUrls: ['./survey-question-result-box.component.scss']
})

export class SurveyQuestionResultBoxComponent {
  @Input() data: Survey[] = []; 
  
  selectedAnswerTypeIndex = 0;

}