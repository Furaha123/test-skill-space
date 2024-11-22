import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { CompanyRegistrationFormComponent } from "./company-registration-form.component";
import { InputComponent } from "../../../shared/components/input/input.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { LoaderComponent } from "../../../shared/components/loader/loader.component";
import { Subscription } from "rxjs";

interface MockFileReader {
  readAsDataURL: jest.Mock;
  onload: ((event: { target: MockFileReader }) => void) | null;
  result: string;
}

describe("CompanyRegistrationFormComponent", () => {
  let component: CompanyRegistrationFormComponent;
  let fixture: ComponentFixture<CompanyRegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CompanyRegistrationFormComponent,
        InputComponent,
        ButtonComponent,
        LoaderComponent,
      ],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Form Initialization", () => {
    it("should initialize the form with empty values", () => {
      const formControls = {
        name: "",
        email: "",
        certificate: null,
        website: "",
        logo: null,
        phoneNumber: "",
        password: "",
        passwordConfirm: "",
      };

      Object.entries(formControls).forEach(([key, value]) => {
        expect(component.form.get(key)?.value).toBe(value);
      });
    });

    it("should mark required fields as invalid when empty", () => {
      const requiredControls = [
        "name",
        "email",
        "certificate",
        "phoneNumber",
        "password",
        "passwordConfirm",
      ];

      requiredControls.forEach((controlName) => {
        const control = component.form.get(controlName);
        expect(control?.errors?.["required"]).toBeTruthy();
      });
    });
  });

  describe("Form Validation", () => {
    it("should validate email format", () => {
      const emailControl = component.form.get("email");

      emailControl?.setValue("invalid-email");
      expect(emailControl?.errors?.["email"]).toBeTruthy();

      emailControl?.setValue("valid@email.com");
      expect(emailControl?.errors).toBeNull();
    });

    it("should validate phone number format", () => {
      const phoneControl = component.form.get("phoneNumber");

      phoneControl?.setValue("123");
      expect(phoneControl?.errors?.["pattern"]).toBeTruthy();

      phoneControl?.setValue("+250789123456");
      expect(phoneControl?.errors).toBeNull();
    });

    it("should validate password format", () => {
      const passwordControl = component.form.get("password");

      passwordControl?.setValue("weak");
      expect(passwordControl?.errors?.["pattern"]).toBeTruthy();

      passwordControl?.setValue("StrongPass123!");
      expect(passwordControl?.errors).toBeNull();
    });
  });

  describe("isControlInvalid Method", () => {
    it("should return false for untouched controls", () => {
      expect(component.isControlInvalid("name")).toBeFalsy();
    });

    it("should return true for touched invalid controls", () => {
      const nameControl = component.form.get("name");
      nameControl?.markAsTouched();
      expect(component.isControlInvalid("name")).toBeTruthy();
    });

    it("should return true when form is submitted with invalid controls", () => {
      component.submitted = true;
      expect(component.isControlInvalid("name")).toBeTruthy();
    });
  });

  describe("File Handling", () => {
    let mockFileReader: MockFileReader;

    beforeEach(() => {
      mockFileReader = {
        readAsDataURL: jest.fn(),
        onload: null,
        result: "",
      };
      global.FileReader = jest.fn(
        () => mockFileReader,
      ) as unknown as typeof FileReader;
    });

    const createFileEvent = (fileName: string, fileType: string): Event => {
      const file = new File(["dummy content"], fileName, { type: fileType });
      return {
        target: {
          files: [file],
        },
      } as unknown as Event;
    };

    it("should handle certificate file upload", () => {
      const event = createFileEvent("test.pdf", "application/pdf");
      mockFileReader.result = "data:application/pdf;base64,dummy";

      component.onAddCertificate(event, "certificate");

      if (mockFileReader.onload) {
        mockFileReader.onload({ target: mockFileReader });
      }

      expect(component.form.get("certificate")?.value).toBe(
        "data:application/pdf;base64,dummy",
      );
    });

    it("should handle logo file upload", () => {
      const event = createFileEvent("logo.png", "image/png");
      mockFileReader.result = "data:image/png;base64,dummy";

      component.onAddCertificate(event, "logo");

      if (mockFileReader.onload) {
        mockFileReader.onload({ target: mockFileReader });
      }

      expect(component.form.get("logo")?.value).toBe(
        "data:image/png;base64,dummy",
      );
    });
  });

  describe("Form Submission", () => {
    it("should not set submitted flag when form is invalid", () => {
      component.onSubmit();
      expect(component.submitted).toBeFalsy();
    });

    it("should set submitted flag when form is valid", () => {
      component.form.patchValue({
        name: "Test Company",
        email: "test@company.com",
        certificate: "base64-certificate",
        phoneNumber: "+250789123456",
        password: "StrongPass123!",
        passwordConfirm: "StrongPass123!",
      });

      component.onSubmit();
      expect(component.submitted).toBeTruthy();
    });
  });

  describe("Component Lifecycle", () => {
    it("should unsubscribe on destroy", () => {
      const mockSubscription: Partial<Subscription> = {
        unsubscribe: jest.fn(),
      };
      component.subscription = mockSubscription as Subscription;

      component.ngOnDestroy();
      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });
  });
});
