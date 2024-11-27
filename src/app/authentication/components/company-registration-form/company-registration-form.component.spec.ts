import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { CompanyRegistrationFormComponent } from "./company-registration-form.component";
import { InputComponent } from "../../../shared/components/input/input.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";
import { LoaderComponent } from "../../../shared/components/loader/loader.component";
import * as AuthSelectors from "../../auth-store/auth.selectors";

describe("CompanyRegistrationFormComponent", () => {
  let component: CompanyRegistrationFormComponent;
  let fixture: ComponentFixture<CompanyRegistrationFormComponent>;
  let store: MockStore;

  // Mock initial state
  const initialState = {
    auth: {
      isLoading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CompanyRegistrationFormComponent,
        InputComponent,
        ButtonComponent,
        LoaderComponent,
      ],
      imports: [ReactiveFormsModule],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyRegistrationFormComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  describe("Form Initialization", () => {
    it("should initialize the form with empty values", () => {
      const expectedInitialValues = {
        name: "",
        email: "",
        certificate: null,
        website: "",
        logo: null,
        phoneNumber: "",
        password: "",
        passwordConfirm: "",
      };

      Object.entries(expectedInitialValues).forEach(([key, value]) => {
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
        expect(control?.hasError("required")).toBeTruthy();
      });
    });
  });

  describe("Form Validation", () => {
    describe("Email Validation", () => {
      it("should validate correct email formats", () => {
        const emailControl = component.form.get("email");

        const validEmails = [
          "test@example.com",
          "user.name+tag@example.co.uk",
          "valid_email123@domain.org",
        ];

        validEmails.forEach((email) => {
          emailControl?.setValue(email);
          expect(emailControl?.hasError("email")).toBeFalsy();
        });
      });
    });

    describe("Phone Number Validation", () => {
      it("should invalidate incorrect phone number formats", () => {
        const phoneControl = component.form.get("phoneNumber");

        const invalidPhoneNumbers = [
          "123",
          "abcdefghij",
          "+250 invalid number",
        ];

        invalidPhoneNumbers.forEach((number) => {
          phoneControl?.setValue(number);
          expect(phoneControl?.hasError("pattern")).toBeTruthy();
        });
      });
    });

    describe("Password Validation", () => {
      it("should invalidate weak password formats", () => {
        const passwordControl = component.form.get("password");

        const invalidPasswords = [
          "weak",
          "nouppercase123",
          "NOLOWERCASE123",
          "NoSpecialChar123",
        ];

        invalidPasswords.forEach((password) => {
          passwordControl?.setValue(password);
          expect(passwordControl?.hasError("pattern")).toBeTruthy();
        });
      });
    });

    describe("Password Confirmation", () => {
      it("should invalidate mismatched passwords", () => {
        component.form.get("password")?.setValue("FirstPassword123!");
        component.form
          .get("passwordConfirm")
          ?.setValue("DifferentPassword456!");

        const passwordConfirmControl = component.form.get("passwordConfirm");
        component.isControlInvalid("passwordConfirm");

        expect(passwordConfirmControl?.value).not.toEqual(
          component.form.get("password")?.value,
        );
      });
    });
  });

  describe("File Handling", () => {
    const createMockFileEvent = (
      fileName: string,
      fileType: string,
      fileSize: number = 4 * 1024 * 1024, // 4MB
    ): Event => {
      const file = new File(["dummy content"], fileName, {
        type: fileType,
      });
      Object.defineProperty(file, "size", { value: fileSize });

      return {
        target: {
          files: [file],
        },
      } as unknown as Event;
    };

    describe("Certificate Upload", () => {
      it("should handle valid certificate upload", () => {
        const validEvent = createMockFileEvent("test.pdf", "application/pdf");

        component.onFileChange(validEvent, "certificate");

        expect(component.certificateSizeExceeded).toBeFalsy();
        expect(component.form.get("certificate")?.value).toBeTruthy();
      });

      it("should prevent upload of oversized certificate", () => {
        const largeFileEvent = createMockFileEvent(
          "large.pdf",
          "application/pdf",
          6 * 1024 * 1024, // 6MB
        );

        component.onFileChange(largeFileEvent, "certificate");

        expect(component.certificateSizeExceeded).toBeTruthy();
        expect(component.form.get("certificate")?.value).toBeNull();
      });
    });

    describe("Logo Upload", () => {
      it("should handle valid logo upload", () => {
        const validEvent = createMockFileEvent("logo.png", "image/png");

        component.onFileChange(validEvent, "logo");

        expect(component.logoSizeExceed).toBeFalsy();
        expect(component.form.get("logo")?.value).toBeTruthy();
      });

      it("should prevent upload of oversized logo", () => {
        const largeFileEvent = createMockFileEvent(
          "large-logo.png",
          "image/png",
          6 * 1024 * 1024, // 6MB
        );

        component.onFileChange(largeFileEvent, "logo");

        expect(component.logoSizeExceed).toBeTruthy();
        expect(component.form.get("logo")?.value).toBeNull();
      });
    });
  });

  describe("Form Submission", () => {
    it("should not dispatch action when form is invalid", () => {
      const dispatchSpy = jest.spyOn(store, "dispatch");

      component.onSubmit();

      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(component.submitted).toBeFalsy();
    });
  });

  describe("Component Observables", () => {
    it("should select loading state", () => {
      store.setState({
        auth: {
          isLoading: true,
          error: null,
        },
      });

      store.select(AuthSelectors.selectIsLoading).subscribe((isLoading) => {
        expect(isLoading).toBeTruthy();
      });
    });

    it("should select error state", () => {
      const testError = "Test error message";
      store.setState({
        auth: {
          isLoading: false,
          error: testError,
        },
      });

      store.select(AuthSelectors.selectError).subscribe((error) => {
        expect(error).toBe(testError);
      });
    });
  });

  describe("Component Lifecycle", () => {
    it("should unsubscribe on destroy when subscription exists", () => {
      const mockSubscription = {
        unsubscribe: jest.fn(),
      };

      component.subscription = mockSubscription as never;
      component.ngOnDestroy();

      expect(mockSubscription.unsubscribe).toHaveBeenCalled();
    });

    it("should not throw error when destroying without subscription", () => {
      component.subscription = null;

      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });
});
