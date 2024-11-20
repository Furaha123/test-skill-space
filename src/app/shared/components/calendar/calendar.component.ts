import { Component, EventEmitter, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent implements OnInit {
  @Output() dateOfBirth: EventEmitter<Date> = new EventEmitter<Date>();

  currentDate: Date = new Date();
  selectedDate: Date = new Date();
  showCalendar = false;
  daysOfWeek: string[] = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  calendarDays: { day: number | null; isCurrentMonth: boolean }[] = [];
  showMonthDropdown = false;
  showYearDropdown = false;
  yearRange: number[] = [];

  ngOnInit() {
    this.generateCalendarDays();
    this.populateYearRange();
  }

  populateYearRange() {
    const currentYear = this.currentDate.getFullYear();
    this.yearRange = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
  }

  toggleMonthDropdown() {
    this.showMonthDropdown = !this.showMonthDropdown;
    this.showYearDropdown = false;
  }

  toggleYearDropdown() {
    this.showYearDropdown = !this.showYearDropdown;
    this.showMonthDropdown = false;
  }

  selectMonth(index: number) {
    this.currentDate = new Date(this.currentDate.getFullYear(), index, 1);
    this.generateCalendarDays();
    this.showMonthDropdown = false;
  }

  selectYear(year: number) {
    this.currentDate = new Date(year, this.currentDate.getMonth(), 1);
    this.generateCalendarDays();
    this.showYearDropdown = false;
  }

  generateCalendarDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    this.calendarDays = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      this.calendarDays.push({ day: null, isCurrentMonth: false });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      this.calendarDays.push({ day: i, isCurrentMonth: true });
    }

    const totalDays = this.calendarDays.length;
    const remainingDays = (7 - (totalDays % 7)) % 7;
    for (let i = 1; i <= Math.min(remainingDays, 3); i++) {
      this.calendarDays.push({ day: i, isCurrentMonth: false });
    }
  }

  isSelectedDate(dayInfo: {
    day: number | null;
    isCurrentMonth: boolean;
  }): boolean {
    if (dayInfo.day === null || !dayInfo.isCurrentMonth) {
      return false;
    }
    return (
      dayInfo.day === this.selectedDate.getDate() &&
      this.currentDate.getMonth() === this.selectedDate.getMonth() &&
      this.currentDate.getFullYear() === this.selectedDate.getFullYear()
    );
  }

  selectDate(dayInfo: { day: number | null; isCurrentMonth: boolean }) {
    if (dayInfo.day !== null && dayInfo.isCurrentMonth) {
      this.selectedDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth(),
        dayInfo.day,
      );
      this.logDateOfBirth();
      this.showCalendar = false;
    }
  }

  getWeeks(): { day: number | null; isCurrentMonth: boolean }[][] {
    const weeks: { day: number | null; isCurrentMonth: boolean }[][] = [];
    for (let i = 0; i < this.calendarDays.length; i += 7) {
      weeks.push(this.calendarDays.slice(i, i + 7));
    }
    return weeks;
  }

  logDateOfBirth() {
    this.dateOfBirth.emit(this.selectedDate);
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
    this.showMonthDropdown = false;
    this.showYearDropdown = false;
  }

  formatDate(date: Date): string {
    return `${this.months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  }

  handleClickOutside(event: Event) {
    if (!(event.target as HTMLElement).closest(".calendar-wrapper")) {
      this.showCalendar = false;
      this.showMonthDropdown = false;
      this.showYearDropdown = false;
    }
  }
}
