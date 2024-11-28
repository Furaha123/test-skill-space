import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CareerProgramsComponent } from "./career-programs.component";

describe("CareerProgramsComponent", () => {
  let component: CareerProgramsComponent;
  let fixture: ComponentFixture<CareerProgramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CareerProgramsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CareerProgramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
