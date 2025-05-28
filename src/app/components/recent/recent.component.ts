import { Component, Input } from '@angular/core';
import { CreateNewTodoComponent } from '../create-new-todo/create-new-todo.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent',
  standalone: true,
  imports: [CommonModule, CreateNewTodoComponent],
  templateUrl: './recent.component.html',
  styleUrl: './recent.component.css',
})
export class RecentComponent {
  @Input() data!: number
  @Input() titles: { title: string }[] = [];

}
