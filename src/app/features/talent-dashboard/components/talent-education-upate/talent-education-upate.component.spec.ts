import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { TalentEducationUpateComponent } from "./talent-education-upate.component";
import { EducationRecord } from "../../models/education.record.interface";

describe("TalentEducationUpateComponent", () => {
  let component: TalentEducationUpateComponent;
  let fixture: ComponentFixture<TalentEducationUpateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      declarations: [TalentEducationUpateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TalentEducationUpateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form", () => {
    expect(component.educationForm).toBeDefined();
    expect(component.educationForm.controls["institution"]).toBeDefined();
    expect(component.educationForm.controls["degree"]).toBeDefined();
  });

  it("should patch form values if record is provided", () => {
    const mockRecord: EducationRecord = {
      institution: "Test University",
      address: "123 Test St",
      country: "Test Country",
      qualification: "Bachelor's Degree",
      degree: "Computer Science",
      status: "Graduated",
      startDate: "2015-01-01",
      endDate: "2019-01-01",
      filesCount: 0,
      files: [],
    };

    component.record = mockRecord;
    component.ngOnInit();

    // Expect form to contain the values excluding `files` and `filesCount`
    const expectedFormValues = {
      institution: "Test University",
      address: "123 Test St",
      country: "Test Country",
      qualification: "Bachelor's Degree",
      degree: "Computer Science",
      status: "Graduated",
      startDate: "2015-01-01",
      endDate: "2019-01-01",
    };

    expect(component.educationForm.value).toEqual(expectedFormValues);
  });

  it("should return true for isAddMode when mode is 'add'", () => {
    component.mode = "add";
    expect(component.isAddMode).toBeTruthy();
  });

  it("should return true for isUpdateMode when mode is 'update'", () => {
    component.mode = "update";
    expect(component.isUpdateMode).toBeTruthy();
  });

  it("should emit close event on cancel", () => {
    const emitSpy = jest.spyOn(component.closed, "emit");
    component.onCancel();
    expect(emitSpy).toHaveBeenCalled();
  });

  it("should emit close event on back", () => {
    const emitSpy = jest.spyOn(component.closed, "emit");
    component.onBack();
    expect(emitSpy).toHaveBeenCalled();
  });

  it("should emit close event on navigateBackToList", () => {
    const emitSpy = jest.spyOn(component.closed, "emit");
    component.navigateBackToList();
    expect(emitSpy).toHaveBeenCalled();
  });

  it("should mark institution field as invalid if empty", () => {
    const institutionField = component.educationForm.controls["institution"];
    institutionField.setValue("");
    institutionField.markAsTouched();
    expect(component.isFieldInvalid("institution")).toBeTruthy();
  });

  it("should mark degree field as invalid if empty", () => {
    const degreeField = component.educationForm.controls["degree"];
    degreeField.setValue("");
    degreeField.markAsTouched();
    expect(component.isFieldInvalid("degree")).toBeTruthy();
  });

  it("should show validation errors for empty required fields on form submission", () => {
    component.educationForm.markAllAsTouched();
    expect(component.isFieldInvalid("institution")).toBeTruthy();
    expect(component.isFieldInvalid("degree")).toBeTruthy();
  });
});
