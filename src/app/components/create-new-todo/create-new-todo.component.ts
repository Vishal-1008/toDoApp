import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RecentComponent } from '../recent/recent.component';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { ActivatedRoute } from '@angular/router';

interface TodoItem {
  todo: string;
  pri: any;
  expenseAmt: number;
  isUpdate: boolean;
  getConfirmation?: boolean;
}

interface TodoList {
  type: string;
  title: string;
  date: Date;
  isTitle: boolean;
  getConfirmation:boolean;

  tasks: TodoItem[];
}

@Component({
  selector: 'app-create-new-todo',
  standalone: true,
  imports: [CommonModule, RecentComponent, DatePickerComponent],
  templateUrl: './create-new-todo.component.html',
  styleUrls: ['./create-new-todo.component.css'],
})
export class CreateNewTodoComponent implements OnInit {
  selDate!: Date;
  errorStatus = false;
  errorMsg = '';
  todoLists: TodoList[] = [];
  todoTitles: { title: string }[] = [];
  listType!: string;
  totalExpenses = 0;
  isCalculate = true;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // this.listType = this.route.snapshot.paramMap.get('type') == 'expense' ? 'expense tracker' : 'todo';
    // console.log(this.listType);
    this.route.paramMap.subscribe((params) => {
      this.listType =
        params.get('type')! == 'expense' ? 'expense tracker' : 'todo';
      this.loadDataForType(this.listType);
    });
  }

  // loadDataForType(type: string) {
  //   if (this.isBrowser() && type === 'todo') {
  //     const stored = localStorage.getItem('todoLists');
  //     if (stored) {
  //       const todoLists: TodoList[] = JSON.parse(stored);
  //       const filterTodoList = todoLists.filter(
  //         (todoList: TodoList) => todoList.type === 'todo'
  //       );
  //       this.todoLists = [...filterTodoList];

  //       this.todoTitles = this.todoLists.map((list) => ({
  //         title: list.title,
  //       }));
  //     }
  //   } else if (type === 'expense tracker') {
  //     const stored = localStorage.getItem('todoLists');
  //     if (stored) {
  //       const todoLists: TodoList[] = JSON.parse(stored);
  //       const filterTodoList = todoLists.filter(
  //         (todoList: TodoList) => todoList.type === 'expense tracker'
  //       );
  //       this.todoLists = [...filterTodoList];

  //       this.todoTitles = this.todoLists.map((list) => ({
  //         title: list.title,
  //       }));
  //     }
  //   }
  // }

  loadDataForType(type: string) {
    if (!this.isBrowser()) return;

    const stored = localStorage.getItem('todoLists');
    const allLists: TodoList[] = stored ? JSON.parse(stored) : [];

    // Filter lists based on current type
    const filterTodoList = allLists.filter((list) => list.type === type);

    // Only update display lists, not all data
    this.todoLists = filterTodoList;

    // Update the title display array
    this.todoTitles = this.todoLists.map((list) => ({ title: list.title }));
  }

  showMenu = false;

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  // addTitle(title: string) {
  //   if (this.todoLists.length < 4 && title && title.trim().length > 0) {
  //     this.todoLists.unshift({
  //       type: this.listType,
  //       title: title.trim().charAt(0).toUpperCase() + title.trim().slice(1),
  //       date: this.selDate,
  //       isTitle: true,
  //       getConfirmation: false,
  //       tasks: [
  //         {
  //           todo: 'your todos here!',
  //           pri: 'Medium',
  //           isUpdate: false,
  //           getConfirmation: false,
  //         },
  //       ],
  //     });
  //     this.todoTitles.push({
  //       title: title.trim().charAt(0).toUpperCase() + title.trim().slice(1),
  //     });
  //     this.selDate = undefined!;
  //     this.saveToLocalStorage();
  //   } else if (this.todoLists.length >= 4) {
  //     this.errorStatus = true;
  //     this.errorMsg =
  //       'Cannot create more than 4 todo lists at an instance! Please delete some lists and try again.';

  //     setTimeout(() => {
  //       this.errorStatus = false;
  //       this.errorMsg = '';
  //     }, 4000);
  //   } else if (!title && this.todoLists.length <= 3) {
  //     this.errorStatus = true;
  //     this.errorMsg =
  //       'Cannot create list without title. Enter list title and try again.';

  //     setTimeout(() => {
  //       this.errorStatus = false;
  //       this.errorMsg = '';
  //     }, 4000);
  //   }
  // }

  addTitle(title: string) {
    // Validate title
    if (!title || !title.trim()) {
      this.showError(
        'Cannot create list without title. Enter list title and try again.'
      );
      return;
    }

    if (this.todoLists.length >= 4) {
      this.showError(
        'Cannot create more than 4 todo lists at an instance! Please delete some lists and try again.'
      );
      return;
    }

    const formattedTitle =
      title.trim().charAt(0).toUpperCase() + title.trim().slice(1);

    const newList = {
      type: this.listType, // "todo" or "expense tracker"
      title: formattedTitle,
      date: this.selDate,
      isTitle: true,
      getConfirmation: false,
      tasks: [
        {
          todo: 'your todos here!',
          pri: 'Medium',
          expenseAmt: 0,
          isUpdate: false,
          getConfirmation: false,
        },
      ],
    };

    // ✅ Retrieve existing data from localStorage
    const stored = localStorage.getItem('todoLists');
    const allLists: TodoList[] = stored ? JSON.parse(stored) : [];

    // ✅ Add new list to the master array
    allLists.unshift(newList);

    // ✅ Save everything back
    localStorage.setItem('todoLists', JSON.stringify(allLists));

    // ✅ Update only the visible type lists on screen
    this.loadDataForType(this.listType);

    // ✅ Update titles and reset date
    // this.todoTitles.push({ title: formattedTitle });
    this.selDate = undefined!;
  }

  showError(message: string) {
    this.errorStatus = true;
    this.errorMsg = message;

    setTimeout(() => {
      this.errorStatus = false;
      this.errorMsg = '';
    }, 4000);
  }

  addTodo(listIndex: number, todoText: string, priority: any) {
    console.log(priority);

    if (todoText.trim() && priority !== 'Priority') {
      this.todoLists[listIndex].tasks.unshift({
        todo:
          todoText.trim().charAt(0).toUpperCase() + todoText.trim().slice(1),
        pri: this.listType == 'todo' ? priority : '',
        expenseAmt: this.listType == 'expense tracker' ? priority :  0,
        isUpdate: false,
      });
      console.log(this.todoLists[listIndex].tasks[0]);

      this.saveToLocalStorage();
    } else {
      this.errorStatus = true;
      this.errorMsg =
        'Cannot create todo without text or priority. Please enter both and try again.';

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
    this.todoLists[listIndex].tasks[taskIndex].getConfirmation =
      !this.todoLists[listIndex].tasks[taskIndex].getConfirmation;
    this.todoLists[listIndex].tasks.splice(taskIndex, 1);
    this.saveToLocalStorage();
  }

  deleteList(listIndex: number) {
    if (!this.isBrowser()) return;

    // Step 1: Get all lists (both todos + expense trackers)
    const stored = localStorage.getItem('todoLists');
    const allLists: TodoList[] = stored ? JSON.parse(stored) : [];

    // Step 2: Identify the current list being deleted
    const deletedList = this.todoLists[listIndex];

    // Step 3: Remove it from the master list
    const updatedLists = allLists.filter(
      (list) =>
        !(list.title === deletedList.title && list.type === this.listType)
    );

    // Step 4: Update localStorage
    localStorage.setItem('todoLists', JSON.stringify(updatedLists));

    // Step 5: Remove from the currently displayed lists
    this.todoLists.splice(listIndex, 1);
    this.todoTitles.splice(listIndex, 1);

    // Step 6: Refresh view
    this.loadDataForType(this.listType);
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

  calculateExpense() {
    this.todoLists.forEach((list) => {
      if (list.type == 'expense tracker' && this.isCalculate) {
        list.tasks.forEach((expenseAmt) => {
          const amount = Number(expenseAmt.expenseAmt) || 0;
          this.totalExpenses += amount;
          this.isCalculate = false;
          console.log(expenseAmt);
          
        });
      } else if (!this.isCalculate) {
        this.showError('Already calculated all above expenses.');
      }
    }) 
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
