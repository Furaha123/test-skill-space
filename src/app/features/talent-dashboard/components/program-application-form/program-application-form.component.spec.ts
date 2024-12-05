import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ProgramApplicationFormComponent } from "./program-application-form.component";

describe("ProgramApplicationFormComponent", () => {
  let component: ProgramApplicationFormComponent;
  let fixture: ComponentFixture<ProgramApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProgramApplicationFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
