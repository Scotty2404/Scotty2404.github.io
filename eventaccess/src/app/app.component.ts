import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatListItem } from '@angular/material/list';
import { MatNavList } from '@angular/material/list';

import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { MainLayoutComponent } from './pages/main-layout/main-layout.component';





@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule, 
    MatSidenavModule,
    MatListModule,
    MatListItem,
    MatNavList,
    LandingPageComponent,
    CalendarPageComponent,
    MainLayoutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'eventaccess';
}
