import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CalendarComponent } from "./calendar.component";

describe("CalendarComponent", () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should generate calendar days on init", () => {
    const spy = jest.spyOn(component, "generateCalendarDays");
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it("should populate year range on init", () => {
    component.ngOnInit();
    expect(component.yearRange.length).toBeGreaterThan(0);
  });

  it("should toggle month dropdown", () => {
    component.showMonthDropdown = false;
    component.toggleMonthDropdown();
    expect(component.showMonthDropdown).toBeTruthy();
    expect(component.showYearDropdown).toBeFalsy();
  });

  it("should toggle year dropdown", () => {
    component.showYearDropdown = false;
    component.toggleYearDropdown();
    expect(component.showYearDropdown).toBeTruthy();
    expect(component.showMonthDropdown).toBeFalsy();
  });

  it("should select a month and generate calendar days", () => {
    const spy = jest.spyOn(component, "generateCalendarDays");
    component.selectMonth(5); // Select June
    expect(component.currentDate.getMonth()).toBe(5);
    expect(spy).toHaveBeenCalled();
    expect(component.showMonthDropdown).toBeFalsy();
  });

  it("should select a year and generate calendar days", () => {
    const spy = jest.spyOn(component, "generateCalendarDays");
    component.selectYear(2025);
    expect(component.currentDate.getFullYear()).toBe(2025);
    expect(spy).toHaveBeenCalled();
    expect(component.showYearDropdown).toBeFalsy();
  });

  it("should select a date and emit dateOfBirth event", () => {
    const dateSpy = jest.spyOn(component.dateOfBirth, "emit");
    const testDate = { day: 15, isCurrentMonth: true };
    component.selectDate(testDate);
    expect(component.selectedDate.getDate()).toBe(15);
    expect(dateSpy).toHaveBeenCalledWith(component.selectedDate);
    expect(component.showCalendar).toBeFalsy();
  });

  it("should correctly identify selected date", () => {
    component.selectedDate = new Date(2022, 5, 15);
    component.currentDate = new Date(2022, 5, 1);
    const dayInfo = { day: 15, isCurrentMonth: true };
    expect(component.isSelectedDate(dayInfo)).toBeTruthy();
  });

  it("should toggle the calendar visibility", () => {
    component.showCalendar = false;
    component.toggleCalendar();
    expect(component.showCalendar).toBeTruthy();
  });

  it("should format date correctly", () => {
    const date = new Date(2022, 5, 15);
    expect(component.formatDate(date)).toBe("June 15, 2022");
  });

  it("should get weeks correctly", () => {
    component.generateCalendarDays();
    const weeks = component.getWeeks();
    expect(weeks.length).toBeGreaterThan(0);
    expect(weeks[0].length).toBe(7); // A week has 7 days
  });
});
