import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  ReactiveFormsModule,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { TalentRegistrationFormComponent } from "./talent-registration-form.component";
import { AuthServiceService } from "../../../core/services/auth/auth-service.service";
import { forwardRef } from "@angular/core";
import { SharedModule } from "../../../shared/shared.module";

describe("TalentRegistrationFormComponent", () => {
  let component: TalentRegistrationFormComponent;
  let fixture: ComponentFixture<TalentRegistrationFormComponent>;

  beforeEach(async () => {
    const mockAuthService = {
      talentRegister: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [TalentRegistrationFormComponent],
      imports: [ReactiveFormsModule, FormsModule, SharedModule],
      providers: [
        {
          provide: AuthServiceService,
          useValue: mockAuthService,
        },
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => TalentRegistrationFormComponent),
          multi: true,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TalentRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("Component Initialization", () => {
    it("should create the component", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize form with all controls", () => {
      const expectedControls = [
        "userName",
        "email",
        "phoneNumber",
        "password",
        "passwordConfirm",
      ];
      expectedControls.forEach((control) => {
        expect(component.form.contains(control)).toBeTruthy();
      });
    });

    it("should have empty initial form values", () => {
      expect(component.form.value).toEqual({
        userName: "",
        email: "",
        phoneNumber: "",
        password: "",
        passwordConfirm: "",
      });
    });
  });

  describe("Form Control Validation", () => {
    it("should mark control as invalid when empty", () => {
      const userNameControl = component.form.get("userName");
      userNameControl?.setValue("");
      expect(userNameControl?.valid).toBeFalsy();
    });

    it("should handle invalid control state", () => {
      const userNameControl = component.form.get("userName");

      // Untouched control
      userNameControl?.setValue("");
      expect(component.isControlInvalid("userName")).toBeFalsy();

      // Touched invalid control
      userNameControl?.markAsTouched();
      expect(component.isControlInvalid("userName")).toBeTruthy();

      // Submitted state
      component.submitted = true;
      expect(component.isControlInvalid("userName")).toBeTruthy();
    });
  });

  describe("Form Submission", () => {
    it("should set submitted flag to true on submit", () => {
      component.onSubmit();
      expect(component.submitted).toBeTruthy();
    });
  });

  describe("Password Confirmation", () => {
    it("should validate password confirmation", () => {
      const passwordControl = component.form.get("password");
      const confirmControl = component.form.get("passwordConfirm");

      passwordControl?.setValue("Password123!");
      confirmControl?.setValue("Password123!");
      confirmControl?.markAsTouched();
      expect(component.isControlInvalid("passwordConfirm")).toBeFalsy();

      confirmControl?.setValue("DifferentPassword123!");
      expect(component.isControlInvalid("passwordConfirm")).toBeTruthy();
    });
  });
});
