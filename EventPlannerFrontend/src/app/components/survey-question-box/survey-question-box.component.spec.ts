import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyQuestionBoxComponent } from './survey-question-box.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SurveyQuestionBoxComponent', () => {
  let component: SurveyQuestionBoxComponent;
  let fixture: ComponentFixture<SurveyQuestionBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyQuestionBoxComponent],
      schemas: [NO_ERRORS_SCHEMA] // Ignoriere unbekannte Elemente
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyQuestionBoxComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply filter', () => {
    component.dataSource = new MatTableDataSource([{ question: 'Frage 1', options: ['Option 1'] }]);
    component.applyFilter({ target: { value: 'Frage 1' } } as any);
    expect(component.dataSource.filter).toBe('frage 1');
  });
});