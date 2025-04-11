import { AfterViewInit, Component, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';


interface Question {
  question: string;
  options: string[];
}

@Component({
  selector: 'app-survey-question-box',
  imports: [MatFormFieldModule,
            MatLabel,
            MatIcon,
            MatPaginatorModule,
            MatTableModule,
  ],
  templateUrl: './survey-question-box.component.html',
  styleUrls: ['./survey-question-box.component.scss']
})
export class SurveyQuestionBoxComponent implements AfterViewInit {
  @Input() data: any[] = [];
  displayedColumns: string[] = ['question', 'options', 'actions'];
  dataSource!: MatTableDataSource<any>;
  survey = { title: '', questions: [] as Question[] };
  newQuestion: { question: string; options: string[] } = { question: '', options: [] };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editQuestion(question: { question: string; options: string[] }) {
    this.newQuestion = { ...question }; // Setze newQuestion auf die zu bearbeitende Frage
  }

  deleteQuestion(question: { question: string; options: string[] }) {
    const index = this.survey.questions.indexOf(question);
    if (index >= 0) {
      this.survey.questions.splice(index, 1); // Entferne die Frage aus dem Array
    }
  }
}