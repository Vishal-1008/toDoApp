import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CalendarModule, FormsModule, CalendarModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
})
export class DatePickerComponent {
  @Output() selectedDate = new EventEmitter<any>();
  date!: Date;
  minDate: Date;

  constructor() {
    this.minDate = new Date();
  }

  emitDate() {
    this.selectedDate.emit(this.date);
  }

  resetDate() {
    this.date = undefined!;
  }
}
