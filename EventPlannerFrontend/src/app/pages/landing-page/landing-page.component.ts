import { Component } from '@angular/core';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButton } from '@angular/material/button';
import { NgFor } from '@angular/common';
import { EventBoxComponent } from '../../components/event-box/event-box.component';
import { DataService } from '../../services/data.service';
import { AddEventPageComponent } from '../add-event-page/add-event-page.component';

@Component({
  selector: 'app-landing-page',
  imports: [
    MatButton, 
    MatCheckboxModule,
    RouterLink,
    MatButtonModule,
    NgFor,
    EventBoxComponent,
    AddEventPageComponent
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  isLoaded = false;
  isFailed = false;
  eventList: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    try {
      this.eventList = this.dataService.getEventList();
      this.isLoaded = true;
    } catch (error) {
      this.isFailed = true;
    }
  }
}