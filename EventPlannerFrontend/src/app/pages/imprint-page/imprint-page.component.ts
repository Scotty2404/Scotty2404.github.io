import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-imprint-page',
  imports: [
    MatCardModule,
    MatIconModule,
    RouterLink,
    MatButtonModule
  ],
  templateUrl: './imprint-page.component.html',
  styleUrl: './imprint-page.component.scss'
})
export class ImprintPageComponent {

}
