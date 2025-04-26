import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-imprint-page',
  imports: [
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './imprint-page.component.html',
  styleUrl: './imprint-page.component.scss'
})
export class ImprintPageComponent {

}
