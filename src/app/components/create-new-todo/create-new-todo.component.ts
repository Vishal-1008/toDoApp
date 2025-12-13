import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RecentComponent } from '../recent/recent.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';

interface TodoItem {
  todo: string;
  pri: string;
  isUpdate: boolean;
  getConfirmation?: boolean;
}

interface TodoList {
  title: string;
  date: Date;
  isTitle: boolean;
  getConfirmation:boolean;

  tasks: TodoItem[];
}

@Component({
  selector: 'app-create-new-todo',
  standalone: true,
  imports: [
    CommonModule,
    RecentComponent,
    DatePickerComponent
  ],
  templateUrl: './create-new-todo.component.html',
  styleUrls: ['./create-new-todo.component.css'],
})
export class CreateNewTodoComponent implements OnInit{
  selDate!: Date;
  errorStatus = false;
  errorMsg = '';
  todoLists: TodoList[] = [];
  todoTitles: { title: string }[] = [];

  ngOnInit() {
  if (this.isBrowser()) {
    const stored = localStorage.getItem('todoLists');
    if (stored) {
      this.todoLists = JSON.parse(stored);
      this.todoTitles = this.todoLists.map(list => ({ title: list.title }));
    }
  }
}

  addTitle(title: string) {
    if (this.todoLists.length < 5 && title && title.trim().length > 0) {
      this.todoLists.unshift({
        title: title.trim().charAt(0).toUpperCase() + title.trim().slice(1),
        date: this.selDate,
        isTitle: true,
        getConfirmation: false,
        tasks: [
          {
            todo: 'your todos here!', 
            pri: 'Medium',
            isUpdate: false,
            getConfirmation: false,
          },
        ],
      });
      this.todoTitles.push({
        title: title.trim().charAt(0).toUpperCase() + title.trim().slice(1)
      });
      this.selDate = undefined!;
      this.saveToLocalStorage();
    } else if (this.todoLists.length >= 5) {
      this.errorStatus = true;
      this.errorMsg = 'Cannot create more than 5 todo lists at an instance! Please delete some lists and try again.';

      setTimeout(() => {
        this.errorStatus = false;
        this.errorMsg = '';
      }, 4000);
    } else if (!title && this.todoLists.length <= 3) {
      this.errorStatus = true;
      this.errorMsg = 'Cannot create list without title. Enter list title and try again.';

      setTimeout(() => {
        this.errorStatus = false;
        this.errorMsg = '';
      }, 4000);
    }
  }

  addTodo(listIndex: number, todoText: string, priority: string) {
    if (todoText.trim() && priority !== 'Priority') {
      this.todoLists[listIndex].tasks.unshift({
        todo:
          todoText.trim().charAt(0).toUpperCase() + todoText.trim().slice(1),
        pri: priority,
        isUpdate: false,
      });
      this.saveToLocalStorage();
    } else {
      this.errorStatus = true;
      this.errorMsg = 'Cannot create todo without text or priority. Please enter both and try again.';

      setTimeout(() => {
        this.errorStatus = false;
        this.errorMsg = '';
      }, 4000);
    }
  }

  saveTodo(listIndex: number, taskIndex: number, updatedText: string) {
    this.todoLists[listIndex].tasks[taskIndex].todo = updatedText;
    this.todoLists[listIndex].tasks[taskIndex].isUpdate = false;
    this.saveToLocalStorage();
  }

  deleteTodo(listIndex: number, taskIndex: number) {
    this.todoLists[listIndex].tasks[taskIndex].getConfirmation = !this.todoLists[listIndex].tasks[taskIndex].getConfirmation;
    this.todoLists[listIndex].tasks.splice(taskIndex, 1);
    this.saveToLocalStorage();
  }

  deleteList(listIndex: number) {
    this.todoLists[listIndex].getConfirmation = !this.todoLists[listIndex].getConfirmation;
    this.todoLists.splice((listIndex), 1);
    this.todoTitles.splice((listIndex), 1);
    this.saveToLocalStorage();
  }

  moveUp(listIndex: number) {
    const [todoList] = this.todoLists.splice(listIndex, 1);
    const [title] = this.todoTitles.splice(listIndex, 1);

    if (listIndex - 1 >= 0) {
      this.todoLists.splice(listIndex - 1, 0, todoList);
      this.todoTitles.splice(listIndex - 1, 0, title);
      this.saveToLocalStorage();
    } else {
      this.todoLists.splice(listIndex, 0, todoList);
      this.todoTitles.splice(listIndex, 0, title);
      this.saveToLocalStorage();
    }

  }

  moveDown(listIndex: number) {
    const [todoList] = this.todoLists.splice(listIndex, 1);
    const [title] = this.todoTitles.splice(listIndex, 1);
    this.todoLists.splice(listIndex + 1, 0, todoList);
    this.todoTitles.splice(listIndex + 1, 0, title);
    this.saveToLocalStorage();
  }

  date(date: Date) {
    if (date) {
      this.selDate = date;
    }
  }
  
 saveToLocalStorage() {
  if (this.isBrowser()) {
    localStorage.setItem('todoLists', JSON.stringify(this.todoLists));
  }
}

  isBrowser(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage;
}
}
