import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule, Router } from '@angular/router';

import { ApiService } from '../../services/api.service';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatListItem } from '@angular/material/list';
import { MatNavList } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

import { LandingPageComponent } from '../landing-page/landing-page.component';
// Remove this import
// import { CalendarPageComponent } from '../calendar-page/calendar-page.component';
import { ContactPageComponent } from '../contact-page/contact-page.component';
import { ImprintPageComponent } from '../imprint-page/imprint-page.component';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from '../../components/settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
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
    MatMenuModule,
    LandingPageComponent,
    // Remove this from imports
    // CalendarPageComponent,
    ContactPageComponent,
    ImprintPageComponent,
    SettingsDialogComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {
  userName: string = '';

  ngOnInit() {
    this.getUserName();
  }

  constructor(
    private apiService: ApiService, 
    private dialog: MatDialog,
    private router: Router
  ) {}

  getUserName() {
    this.apiService.getUser().subscribe((response) => {
      console.log(response.firstname + ' ' + response.lastname);
      this.userName = `${response.firstname} ${response.lastname}`;
    }, (error) => {
      console.log('Failed to get User Data', error);
    });
  }

  openSettingsDialog() {
    this.dialog.open(SettingsDialogComponent, {
      width: '400px'
    });
  }
  
  logout() {
    this.apiService.logout();
    this.router.navigate(['/login']);
  }
}