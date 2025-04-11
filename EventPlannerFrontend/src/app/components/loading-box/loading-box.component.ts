import { Component } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-box',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-box.component.html',
  styleUrl: './loading-box.component.scss'
})
export class LoadingBoxComponent {

}