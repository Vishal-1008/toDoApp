import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RecentComponent } from '../recent/recent.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { ActivatedRoute } from '@angular/router';

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

interface expenseItem {
  expense: string;
  expenseAmount: string;
  isUpdate: boolean;
  getConfirmation?: boolean;
}

interface ExpenseList {
  title: string;
  date: Date;
  isTitle: boolean;
  getConfirmation:boolean;
  expenses: expenseItem[];
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
  todoMasterList: TodoList[] = [];
  expenseMasterList: ExpenseList[] = [];
  todoTitles: { title: string }[] = [];
  expenseTitles: { title: string }[] = [];
  listType: string = '';

  constructor(private route: ActivatedRoute) {}

ngOnInit() {
  this.route.paramMap.subscribe(params => {
    this.listType = params.get('type')!;
  });

  if (!this.isBrowser()) return;

  const storedTodo = localStorage.getItem('todoMasterList');
  if (storedTodo) {
    this.todoMasterList = JSON.parse(storedTodo);
    this.todoTitles = this.todoMasterList.map(list => ({
      title: list.title
    }));
  }

  const storedExpense = localStorage.getItem('expenseMasterList');
  if (storedExpense) {
    this.expenseMasterList = JSON.parse(storedExpense);
    this.expenseTitles = this.expenseMasterList.map(list => ({
      title: list.title
    }));
  }
}


  addTitle(title: string, type: string) {

    if (type == 'todo') {
      if (this.todoMasterList.length < 5 && title && title.trim().length > 0) {
        this.todoMasterList.unshift({
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
        this.saveToLocalStorage('todo');
      } else if (this.todoMasterList.length >= 5) {
        this.errorStatus = true;
        this.errorMsg = 'Cannot create more than 5 todo lists at an instance! Please delete some lists and try again.';

        setTimeout(() => {
          this.errorStatus = false;
          this.errorMsg = '';
        }, 4000);
      } else if (!title && this.todoMasterList.length <= 5) {
        this.errorStatus = true;
        this.errorMsg = 'Cannot create list without title. Enter list title and try again.';

        setTimeout(() => {
          this.errorStatus = false;
          this.errorMsg = '';
        }, 4000);
      }
  } else if (type == 'expense') {
      if (this.expenseMasterList.length < 5 && title && title.trim().length > 0) {
        this.expenseMasterList.unshift({
          title: title.trim().charAt(0).toUpperCase() + title.trim().slice(1),
          date: this.selDate,
          isTitle: true,
          getConfirmation: false,
          expenses: [
            {
              expense: 'your expenses here!', 
              expenseAmount: '0',
              isUpdate: false,
              getConfirmation: false,
            },
          ],
        });
        this.expenseTitles.push({
          title: title.trim().charAt(0).toUpperCase() + title.trim().slice(1)
        });
        this.selDate = undefined!;
        this.saveToLocalStorage('expense');
      } else if (this.expenseMasterList.length >= 5) {
        this.errorStatus = true;
        this.errorMsg = 'Cannot create more than 5 expense lists at an instance! Please delete some lists and try again.';

        setTimeout(() => {
          this.errorStatus = false;
          this.errorMsg = '';
        }, 4000);
      } else if (!title && this.expenseMasterList.length <= 5) {
        this.errorStatus = true;
        this.errorMsg = 'Cannot create list without title. Enter list title and try again.';

        setTimeout(() => {
          this.errorStatus = false;
          this.errorMsg = '';
        }, 4000);
      }
  }

}

  addTodo(listIndex: number, todoText: string, priority: string) {
    if (todoText.trim() && priority !== 'Priority') {
      this.todoMasterList[listIndex].tasks.unshift({
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
    this.todoMasterList[listIndex].tasks[taskIndex].todo = updatedText;
    this.todoMasterList[listIndex].tasks[taskIndex].isUpdate = false;
    this.saveToLocalStorage();
  }

  deleteTodo(listIndex: number, taskIndex: number) {
    this.todoMasterList[listIndex].tasks[taskIndex].getConfirmation = !this.todoMasterList[listIndex].tasks[taskIndex].getConfirmation;
    this.todoMasterList[listIndex].tasks.splice(taskIndex, 1);
    this.saveToLocalStorage();
  }

  deleteList(listIndex: number) {
    this.todoMasterList[listIndex].getConfirmation = !this.todoMasterList[listIndex].getConfirmation;
    this.todoMasterList.splice((listIndex), 1);
    this.todoTitles.splice((listIndex), 1);
    this.saveToLocalStorage();
  }

  moveUp(listIndex: number) {
    const [todoList] = this.todoMasterList.splice(listIndex, 1);
    const [title] = this.todoTitles.splice(listIndex, 1);

    if (listIndex - 1 >= 0) {
      this.todoMasterList.splice(listIndex - 1, 0, todoList);
      this.todoTitles.splice(listIndex - 1, 0, title);
      this.saveToLocalStorage();
    } else {
      this.todoMasterList.splice(listIndex, 0, todoList);
      this.todoTitles.splice(listIndex, 0, title);
      this.saveToLocalStorage();
    }

  }

  moveDown(listIndex: number) {
    const [todoList] = this.todoMasterList.splice(listIndex, 1);
    const [title] = this.todoTitles.splice(listIndex, 1);
    this.todoMasterList.splice(listIndex + 1, 0, todoList);
    this.todoTitles.splice(listIndex + 1, 0, title);
    this.saveToLocalStorage();
  }

  date(date: Date) {
    if (date) {
      this.selDate = date;
    }
  }
  
 saveToLocalStorage(type?: string) {
  if (this.isBrowser()) {
    if (type === 'todo' && this.todoMasterList.length > 0) {
      localStorage.setItem('todoMasterList', JSON.stringify(this.todoMasterList));
    } else if (type === 'expense' && this.expenseMasterList.length > 0) {
      localStorage.setItem('expenseMasterList', JSON.stringify(this.expenseMasterList));
    }
  }
}

  isBrowser(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage;
}
}
