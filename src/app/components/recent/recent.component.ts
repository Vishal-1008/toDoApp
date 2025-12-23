import { Component, Input } from '@angular/core';
// import { CreateNewTodoComponent } from '../create-new-todo/create-new-todo.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.css'],
})
export class RecentComponent {
  @Input() todoCount!: number;
  @Input() expenseCount!: number;
  @Input() todoTitles: { title: string }[] = [];
  @Input() expenseTitles: { title: string }[] = [];
  @Input() type !: string

}
