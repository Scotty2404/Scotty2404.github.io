import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SurveyPageComponent } from './survey-page.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { of } from 'rxjs';
import { Survey } from "../../models/survey.model"; // Importiere das Survey-Interface

describe('SurveyPageComponent', () => {
  let component: SurveyPageComponent;
  let fixture: ComponentFixture<SurveyPageComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', ['getSurveyList', 'addSurvey']);
    await TestBed.configureTestingModule({
      declarations: [SurveyPageComponent],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: MatDialog, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load surveys on init', () => {
    const surveys: Survey[] = [{ title: 'Umfrage 1', questions: [] }];
    mockDataService.getSurveyList.and.returnValue(of(surveys));
    component.ngOnInit();
    expect(component.surveys).toEqual(surveys);
  });

  it('should open dialog on add survey', () => {
    const dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.callThrough();
    component.openDialog();
    expect(dialogSpy).toHaveBeenCalled();
  });
});