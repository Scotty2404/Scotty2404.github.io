import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { LoadingBoxComponent } from '../../components/loading-box/loading-box.component';
import { LoadingFailedBoxComponent } from '../../components/loading-failed-box/loading-failed-box.component';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-event-to-do-list-page',
  standalone: true,
  imports: [RouterLink, RouterModule, RouterOutlet, MatListModule, MatCardModule, MatButtonModule, MatCheckboxModule, MatInputModule, FormsModule, CommonModule, MatIconModule, MatFormFieldModule, LoadingBoxComponent, LoadingFailedBoxComponent],
  templateUrl: './event-to-do-list-page.component.html',
  styleUrls: ['./event-to-do-list-page.component.scss']
})
export class EventToDoListPageComponent {
  isLoaded = true;
  isFailed = false;

  newTodo = '';
  todos: { text: string; completed: boolean }[] = [];

  addTodo() {
    if (this.newTodo.trim()) {
      this.todos.push({ text: this.newTodo.trim(), completed: false });
      this.newTodo = '';
    }
  }

  deleteTodo(todo: { text: string; completed: boolean }) {
    this.todos = this.todos.filter(t => t !== todo);
  }

}