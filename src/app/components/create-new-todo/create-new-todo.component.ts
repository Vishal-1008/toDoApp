import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { RecentComponent } from '../recent/recent.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { text } from 'node:stream/consumers';
import { ButtonDirective } from "primeng/button";

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
  getConfirmation: boolean;
  tasks: TodoItem[];
}

interface expenseItem {
  expense: string;
  expenseAmount: string;
  isUpdate: boolean;
  getConfirmation?: boolean;
  date?: number;
}

interface ExpenseList {
  title: string;
  date: Date;
  isTitle: boolean;
  getConfirmation: boolean;
  totalExpense: number;
  maxExpenseAmount: any;
  maxExpenseEditable?: boolean;
  expenses: expenseItem[];
}

@Component({
  selector: 'app-create-new-todo',
  standalone: true,
  imports: [
    CommonModule,
    RecentComponent,
    DatePickerComponent,
    FormsModule,
    ButtonDirective,
  ],
  templateUrl: './create-new-todo.component.html',
  styleUrls: ['./create-new-todo.component.css'],
})
export class CreateNewTodoComponent implements OnInit {
  selDate!: Date;
  errorStatus = false;
  errorMsg = '';
  todoMasterList: TodoList[] = [];
  expenseMasterList: ExpenseList[] = [];
  todoTitles: { title: string }[] = [];
  expenseTitles: { title: string }[] = [];
  listType: string = '';
  globalDate: Date = new Date();
  deleteSuccess: boolean = false;
  maxExpense: number = 0;
  maxExpenseEditable: boolean = true;

  @ViewChild('ta') ta!: ElementRef<HTMLTextAreaElement>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.listType = params.get('type')!;
    });

    if (!this.isBrowser()) return;

    const storedTodo = localStorage.getItem('todoMasterList');
    if (storedTodo) {
      this.todoMasterList = JSON.parse(storedTodo);
      this.todoTitles = this.todoMasterList.map((list) => ({
        title: list.title,
      }));
    }

    const storedExpense = localStorage.getItem('expenseMasterList');
    if (storedExpense) {
      this.expenseMasterList = JSON.parse(storedExpense);
      this.expenseTitles = this.expenseMasterList.map((list) => ({
        title: list.title,
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
              todo: 'your todo here!',
              pri: 'Medium',
              isUpdate: false,
              getConfirmation: false,
            },
          ],
        });
        this.todoTitles.push({
          title: title.trim().charAt(0).toUpperCase() + title.trim().slice(1),
        });
        this.selDate = undefined!;
        this.saveToLocalStorage('todo');
      } else if (this.todoMasterList.length >= 5) {
        this.errorStatus = true;
        this.errorMsg =
          'Cannot create more than 5 todo lists at an instance! Please delete some lists and try again.';

        setTimeout(() => {
          this.errorStatus = false;
          this.errorMsg = '';
        }, 4000);
      } else if (!title && this.todoMasterList.length <= 5) {
        this.errorStatus = true;
        this.errorMsg =
          'Cannot create list without title. Enter list title and try again.';

        setTimeout(() => {
          this.errorStatus = false;
          this.errorMsg = '';
        }, 4000);
      }
    } else if (type == 'expense') {
      if (
        this.expenseMasterList.length < 5 &&
        title &&
        title.trim().length > 0
      ) {
        this.expenseMasterList.unshift({
          title: title.trim().charAt(0).toUpperCase() + title.trim().slice(1),
          date: this.selDate,
          isTitle: true,
          getConfirmation: false,
          totalExpense: 0,
          maxExpenseAmount: 'Set max. amount',
          expenses: [
            {
              expense: 'your expense here!',
              expenseAmount: '0',
              isUpdate: false,
              getConfirmation: false,
            },
          ],
        });
        this.expenseTitles.push({
          title: title.trim().charAt(0).toUpperCase() + title.trim().slice(1),
        });
        this.selDate = undefined!;
        this.saveToLocalStorage('expense');
      } else if (this.expenseMasterList.length >= 5) {
        this.errorStatus = true;
        this.errorMsg =
          'Cannot create more than 5 expense lists at an instance! Please delete some lists and try again.';

        setTimeout(() => {
          this.errorStatus = false;
          this.errorMsg = '';
        }, 4000);
      } else if (!title && this.expenseMasterList.length <= 5) {
        this.errorStatus = true;
        this.errorMsg =
          'Cannot create list without title. Enter list title and try again.';

        setTimeout(() => {
          this.errorStatus = false;
          this.errorMsg = '';
        }, 4000);
      }
    }
  }

  autoResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto'; // reset
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  enterEditMode() {
    setTimeout(() => this.autoResize(this.ta.nativeElement));
  }

  setMaxExpense(listIndex: number, maxExpenseAmount: string) {
    if (this.listType === 'expense' && maxExpenseAmount && Number(maxExpenseAmount) >= 0) {
      this.expenseMasterList[listIndex].maxExpenseAmount =
        Number(maxExpenseAmount);
        this.expenseMasterList[listIndex].maxExpenseEditable = true;
      this.saveToLocalStorage('expense');
      this.deleteSuccess = true;
      this.errorStatus = true;
      this.errorMsg = 'Max. expense amount set successfully!';
      setTimeout(() => {
        this.deleteSuccess = false;
        this.errorStatus = false;
        this.errorMsg = '';
      }, 3000);
    } else {
      this.errorStatus = true;
      this.errorMsg = 'Max. expense amount cannot be empty or negative.';
      setTimeout(() => {
        this.errorStatus = false;
        this.errorMsg = '';
      }, 3000);
    }
    console.log(this.expenseMasterList[listIndex].maxExpenseAmount);
    
  }

  addTodo(listIndex: number, text: string, priorityOrAmount: string) {
    if (!text.trim() || priorityOrAmount === 'Priority') {
      this.errorStatus = true;
      this.errorMsg =
        'Cannot create item without text or priority/amount. Please enter all fields and try again.';

      setTimeout(() => {
        this.errorStatus = false;
        this.errorMsg = '';
      }, 4000);

      return;
    }

    const formattedText =
      text.trim().charAt(0).toUpperCase() + text.trim().slice(1);

    if (this.listType === 'todo') {
      this.todoMasterList[listIndex].tasks.unshift({
        todo: formattedText,
        pri: priorityOrAmount,
        isUpdate: false,
        getConfirmation: false,
      });

      this.saveToLocalStorage('todo');
    }

    if (this.listType === 'expense') {
      this.expenseMasterList[listIndex].expenses.unshift({
        expense: formattedText,
        expenseAmount: priorityOrAmount,
        isUpdate: false,
        getConfirmation: false,
        date: Date.now(),
      });

      this.saveToLocalStorage('expense');
    }
  }

  saveTodo(
    listIndex: number,
    taskIndex: number,
    updateTodoOrExpense: string,
    updateExpenseAmount?: string,
  ) {
    if (this.listType === 'todo') {
      this.todoMasterList[listIndex].tasks[taskIndex].todo =
        updateTodoOrExpense;
      this.todoMasterList[listIndex].tasks[taskIndex].isUpdate = false;
      this.saveToLocalStorage('todo');
    }

    if (this.listType === 'expense') {
      this.expenseMasterList[listIndex].expenses[taskIndex].expense =
        updateTodoOrExpense;
      this.expenseMasterList[listIndex].expenses[taskIndex].expenseAmount =
        updateExpenseAmount!;
      this.expenseMasterList[listIndex].expenses[taskIndex].isUpdate = false;
      this.saveToLocalStorage('expense');
    }
  }

  deleteTodo(listIndex: number, itemIndex: number) {
    if (this.listType === 'todo') {
      this.todoMasterList[listIndex].tasks[itemIndex].getConfirmation = false;
      const deletedTask = this.todoMasterList[listIndex].tasks[itemIndex].todo;
      this.todoMasterList[listIndex].tasks.splice(itemIndex, 1);
      this.deleteSuccess = true;

      this.errorStatus = true;
      this.errorMsg = `${deletedTask} has been deleted successfully from ${this.todoMasterList[listIndex].title} list!`;
      setTimeout(() => {
        this.errorStatus = false;
        this.errorMsg = '';
        this.deleteSuccess = false;
      }, 4000);
      this.saveToLocalStorage('todo');
    }

    if (this.listType === 'expense') {
      this.expenseMasterList[listIndex].expenses[itemIndex].getConfirmation =
        false;
      const deletedExpense =
        this.expenseMasterList[listIndex].expenses[itemIndex].expense;
      this.expenseMasterList[listIndex].expenses.splice(itemIndex, 1);
      this.deleteSuccess = true;

      this.errorStatus = true;
      this.errorMsg = `${deletedExpense} has been deleted successfully from ${this.expenseMasterList[listIndex].title} list!`;
      setTimeout(() => {
        this.errorStatus = false;
        this.errorMsg = '';
        this.deleteSuccess = false;
      }, 4000);
      this.saveToLocalStorage('expense');
    }
  }

  deleteList(listIndex: number) {
    if (this.listType === 'todo') {
      this.todoMasterList[listIndex].getConfirmation =
        !this.todoMasterList[listIndex].getConfirmation;
      const deletedList = this.todoMasterList[listIndex].title;
      this.todoMasterList.splice(listIndex, 1);
      this.deleteSuccess = true;

      this.errorStatus = true;
      this.errorMsg = `${deletedList} has been deleted successfully!`;
      setTimeout(() => {
        this.errorStatus = false;
        this.errorMsg = '';
        this.deleteSuccess = false;
      }, 4000);
      this.todoTitles.splice(listIndex, 1);
      this.saveToLocalStorage();
    }
    if (this.listType === 'expense') {
      this.expenseMasterList[listIndex].getConfirmation =
        !this.expenseMasterList[listIndex].getConfirmation;
      const deletedList = this.expenseMasterList[listIndex].title;
      this.expenseMasterList.splice(listIndex, 1);
      this.expenseTitles.splice(listIndex, 1);
      this.deleteSuccess = true;

      this.errorStatus = true;
      this.errorMsg = `${deletedList} has been deleted successfully!`;
      setTimeout(() => {
        this.errorStatus = false;
        this.errorMsg = '';
        this.deleteSuccess = false;
      }, 4000);
      this.saveToLocalStorage('expense');
    }
  }

  moveUp(listIndex: number, type: 'todo' | 'expense') {
    if (type === 'todo') {
      const [todoList] = this.todoMasterList.splice(listIndex, 1);
      const [title] = this.todoTitles.splice(listIndex, 1);

      if (listIndex > 0) {
        this.todoMasterList.splice(listIndex - 1, 0, todoList);
        this.todoTitles.splice(listIndex - 1, 0, title);
      } else {
        this.todoMasterList.splice(listIndex, 0, todoList);
        this.todoTitles.splice(listIndex, 0, title);
      }
    } else {
      const [expenseList] = this.expenseMasterList.splice(listIndex, 1);
      const [title] = this.expenseTitles.splice(listIndex, 1);

      if (listIndex > 0) {
        this.expenseMasterList.splice(listIndex - 1, 0, expenseList);
        this.expenseTitles.splice(listIndex - 1, 0, title);
      } else {
        this.expenseMasterList.splice(listIndex, 0, expenseList);
        this.expenseTitles.splice(listIndex, 0, title);
      }
    }

    this.saveToLocalStorage();
  }

  moveDown(listIndex: number, type: 'todo' | 'expense') {
    if (type === 'todo') {
      if (listIndex === this.todoMasterList.length - 1) return;

      const [todoList] = this.todoMasterList.splice(listIndex, 1);
      const [title] = this.todoTitles.splice(listIndex, 1);

      this.todoMasterList.splice(listIndex + 1, 0, todoList);
      this.todoTitles.splice(listIndex + 1, 0, title);
    } else {
      if (listIndex === this.expenseMasterList.length - 1) return;

      const [expenseList] = this.expenseMasterList.splice(listIndex, 1);
      const [title] = this.expenseTitles.splice(listIndex, 1);

      this.expenseMasterList.splice(listIndex + 1, 0, expenseList);
      this.expenseTitles.splice(listIndex + 1, 0, title);
    }

    this.saveToLocalStorage();
  }

  date(date: Date) {
    if (date) {
      this.selDate = date;
    }
  }

  calculateTotalExpense(listIndex: ExpenseList) {
    return listIndex.expenses.reduce(
      (sum, e) => sum + Number(e.expenseAmount || 0),
      0,
    );
  }

  saveToLocalStorage(type?: string) {
    if (this.isBrowser()) {
      if (type === 'todo' && this.todoMasterList.length > 0) {
        localStorage.setItem(
          'todoMasterList',
          JSON.stringify(this.todoMasterList),
        );
      } else if (type === 'expense' && this.expenseMasterList.length > 0) {
        localStorage.setItem(
          'expenseMasterList',
          JSON.stringify(this.expenseMasterList),
        );
      }
    }
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }
}
