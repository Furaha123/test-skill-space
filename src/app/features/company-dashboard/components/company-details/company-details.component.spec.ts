import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CompanyDetailsComponent } from "./company-details.component";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import {
  FormArray,
  FormBuilder,
  ReactiveFormsModule,
  FormControl,
} from "@angular/forms";
import {
  getUserInformation,
  updateUserInformation,
} from "../../store/company-profile-actions";
import { MOCK_COMPANY_USER } from "../../mock/company-user.mock";
import { CompanyUser } from "../../models/company-user";

describe("CompanyDetailsComponent", () => {
  let component: CompanyDetailsComponent;
  let fixture: ComponentFixture<CompanyDetailsComponent>;
  let store: MockStore;
  const initialState = { companyUser: { user: MOCK_COMPANY_USER } };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyDetailsComponent],
      imports: [ReactiveFormsModule],
      providers: [provideMockStore({ initialState }), FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyDetailsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    jest.spyOn(store, "dispatch").mockImplementation(() => {});
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch getUserInformation on init", () => {
    fixture.detectChanges();
    expect(store.dispatch).toHaveBeenCalledWith(getUserInformation());
  });

  it("should handle file selection within size limit", () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    const event = {
      target: {
        files: [file],
      },
    } as unknown as Event;

    jest.spyOn(component, "readFile");
    component.onFileSelected(event, "logo");
    expect(component.readFile).toHaveBeenCalledWith(file, "logo");
  });

  it("should reject files exceeding size limit", () => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const largeFile = new File(["x".repeat(maxSize + 1)], "large.jpg", {
      type: "image/jpeg",
    });

    // Create an input element and set its files property
    const input = document.createElement("input");
    input.type = "file";
    Object.defineProperty(input, "files", {
      value: [largeFile],
      writable: false,
    });

    // Create an event and dispatch it
    const event = new Event("change", {
      bubbles: true,
      cancelable: true,
    });
    input.dispatchEvent(event);

    // Mock alert and readFile methods
    const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
    jest.spyOn(component, "readFile");

    // Call the method under test
    component.onFileSelected(event, "logo");

    // Check the expectations
    expect(alertSpy).toHaveBeenCalledWith("File size exceeds 5MB limit");
    expect(component.readFile).not.toHaveBeenCalled();
  });

  it("should delete file", () => {
    component.deleteFile("logo");
    expect(component.companyForm.get("logo")?.value).toBe("");
  });

  it("should read file and patch form correctly", () => {
    const file = new File(["test content"], "test.jpg", { type: "image/jpeg" });
    const fileType = "logo";
    const fileReaderMock = {
      result: "data:image/jpeg;base64,testcontent",
      readAsDataURL: jest.fn(),
      onload: jest.fn(),
    };

    jest
      .spyOn(window, "FileReader")
      .mockImplementation(() => fileReaderMock as unknown as FileReader);

    component.readFile(file, fileType);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fileReaderMock.onload as any).call(component, { target: fileReaderMock });

    expect(component.companyForm.get(fileType)?.value).toBe(
      fileReaderMock.result,
    );
  });

  it("should patch form values with complete data", () => {
    const data: CompanyUser = {
      id: "12345",
      name: "Test Company",
      contact: {
        phone: "+250-780-1627",
        email: "test@test.com",
        website: "http://test.com",
      },
      logo: "logo.png",
      documentUrl: "document.pdf",
      password: "password123",
    };
    component.patchFormValues(data);
    const formValue = component.companyForm.value;
    expect(formValue.name).toBe(data.name);
    expect(formValue.countryCode).toBe("+250");
    expect(formValue.phone).toBe("780-1627");
    expect(formValue.email).toBe(data.contact?.email);
    expect(formValue.logo).toBe(data.logo);
    expect(formValue.documentUrl).toBe(data.documentUrl);
    const websitesArray = component.companyForm.get("websites") as FormArray;
    expect(websitesArray.length).toBe(1);
    expect(websitesArray.at(0).value).toBe(data.contact?.website);
  });

  it("should create a FormControl for website with correct validators", () => {
    const control = component.createWebsiteControl();
    expect(control).toBeInstanceOf(FormControl);
    expect(control.valid).toBe(false);
    control.setValue("http://example.com");
    expect(control.valid).toBe(true);
  });

  it("should get websites FormArray", () => {
    component.companyForm.setControl("websites", new FormArray([]));
    const websites = component.websites;
    expect(websites).toBeInstanceOf(FormArray);
  });

  it("should add a website FormControl to websites FormArray", () => {
    component.companyForm.setControl("websites", new FormArray([]));
    component.addWebsite();
    expect(component.websites.length).toBe(1);
    component.addWebsite();
    expect(component.websites.length).toBe(2);
  });

  it("should remove a website FormControl from websites FormArray", () => {
    component.companyForm.setControl(
      "websites",
      new FormArray([
        component.createWebsiteControl(),
        component.createWebsiteControl(),
      ]),
    );
    component.removeWebsite(0);
    expect(component.websites.length).toBe(1);
    component.removeWebsite(0);
    expect(component.websites.length).toBe(1);
  });

  it("should patch form values including website control and handle undefined values", () => {
    component.patchFormValues(MOCK_COMPANY_USER);
    const formValue = component.companyForm.value;

    expect(formValue.name).toBe(MOCK_COMPANY_USER.name);
    expect(formValue.countryCode).toBe("+250");
    expect(formValue.phone).toBe("780-1627");
    expect(formValue.email).toBe(MOCK_COMPANY_USER.contact?.email);
    expect(formValue.logo).toBe(MOCK_COMPANY_USER.logo);
    expect(formValue.documentUrl).toBe(MOCK_COMPANY_USER.documentUrl);

    const websitesArray = component.websites;
    expect(websitesArray.length).toBe(1);
    expect(websitesArray.at(0).value).toBe(MOCK_COMPANY_USER.contact?.website);

    const dataWithUndefinedContact: CompanyUser = {
      id: "12345",
      name: "Test Company",
      contact: undefined,
      logo: "logo.png",
      documentUrl: "document.pdf",
      password: "password123",
    };

    component.patchFormValues(dataWithUndefinedContact);
    const formValueWithUndefinedContact = component.companyForm.value;

    expect(formValueWithUndefinedContact.name).toBe(
      dataWithUndefinedContact.name,
    );
    expect(formValueWithUndefinedContact.countryCode).toBe("+1");
    expect(formValueWithUndefinedContact.phone).toBe("");
    expect(formValueWithUndefinedContact.email).toBe("");
    expect(formValueWithUndefinedContact.logo).toBe(
      dataWithUndefinedContact.logo,
    );
    expect(formValueWithUndefinedContact.documentUrl).toBe(
      dataWithUndefinedContact.documentUrl,
    );

    const websitesArrayWithUndefinedContact = component.websites;
    expect(websitesArrayWithUndefinedContact.length).toBe(0);
  });

  it("should update the countryCode field when onCountryCodeChange is called", () => {
    expect(component.companyForm.get("countryCode")?.value).toBe("+1");

    const newCountryCode = "+250";
    component.onCountryCodeChange(newCountryCode);

    const updatedCountryCode = component.companyForm.get("countryCode")?.value;
    expect(updatedCountryCode).toBe(newCountryCode);
  });

  it("should not proceed with saving if the form is invalid", () => {
    component.companyForm.markAsTouched({ onlySelf: true });
    component.companyForm.setErrors({ invalid: true });
    jest.spyOn(component, "markFormGroupTouched");
    component.onSave();
    expect(component.markFormGroupTouched).toHaveBeenCalledWith(
      component.companyForm,
    );
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it("should dispatch updateUserInformation action with valid form data", () => {
    component.companyForm.patchValue({
      name: "Test Company",
      countryCode: "+250",
      phone: "780-1627",
      email: "test@test.com",
      websites: ["http://example.com"],
      logo: "logo.png",
      documentUrl: "document.pdf",
    });

    component.onSave();

    const expectedUpdatedData = {
      name: "Test Company",
      contact: {
        email: "test@test.com",
        phone: "+250-780-1627",
        website: "http://example.com",
      },
      logo: "logo.png",
      documentUrl: "document.pdf",
    };

    expect(store.dispatch).toHaveBeenCalledWith(
      updateUserInformation({ updatedData: expectedUpdatedData }),
    );
  });

  it("should set isModalOpen to false when closeModal is called", () => {
    component.isModalOpen = true;
    component.closeModal();
    expect(component.isModalOpen).toBe(false);
  });

  it("should return true if the field is invalid and touched or dirty", () => {
    component.companyForm.patchValue({
      name: "Test Company",
    });

    const nameField = component.companyForm.get("name");

    nameField?.markAsTouched();
    nameField?.setErrors({ required: true });

    expect(component.isFieldInvalid("name")).toBe(true);

    nameField?.markAsDirty();
    nameField?.setErrors({ required: true });

    expect(component.isFieldInvalid("name")).toBe(true);
  });

  it("should return false if the field is valid", () => {
    component.companyForm.patchValue({
      name: "Test Company",
    });

    const nameField = component.companyForm.get("name");

    nameField?.setErrors(null);

    expect(component.isFieldInvalid("name")).toBe(false);
  });

  it("should return false if the field is neither touched nor dirty", () => {
    component.companyForm.patchValue({
      name: "",
    });

    const nameField = component.companyForm.get("name");

    nameField?.setErrors({ required: true });
    nameField?.markAsUntouched();
    nameField?.markAsPristine();

    expect(component.isFieldInvalid("name")).toBe(false);
  });

  it("should return false if the field does not exist", () => {
    expect(component.isFieldInvalid("nonExistentField")).toBe(false);
  });
});
