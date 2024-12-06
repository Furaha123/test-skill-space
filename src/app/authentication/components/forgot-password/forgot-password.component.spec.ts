import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  FormBuilder,
  ReactiveFormsModule,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { ToastrService } from "ngx-toastr";
import { ForgotPasswordComponent } from "./forgot-password.component";
import * as AuthActions from "../../auth-store/auth.actions";
import * as AuthSelectors from "../../auth-store/auth.selectors";
import {
  Component,
  Input,
  forwardRef,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "app-input",
  template: '<input [formControl]="control">',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockInputComponent),
      multi: true,
    },
  ],
})
class MockInputComponent implements ControlValueAccessor {
  @Input() label = "";
  @Input() type = "text";
  @Input() placeholder = "";
  @Input() id = "";
  @Input() hasError = false;
  @Input() errorMessage: string[] = [];

  control = new FormControl();
  onChange: (value: unknown) => void = () => {};
  onTouch: () => void = () => {};

  writeValue(value: unknown): void {
    if (value !== undefined) {
      this.control.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }
}

@Component({
  selector: "app-button",
  template:
    '<button [type]="type" [disabled]="isDisabled" (click)="onClick()">{{text}}</button>',
})
class MockButtonComponent {
  @Input() text = "";
  @Input() type: "submit" | "button" = "button";
  @Input() isDisabled = false;
  @Input() customClasses = "";
  @Input() isActive = false;
  @Output() handleClick = new EventEmitter<void>();

  onClick(): void {
    if (!this.isDisabled) {
      this.handleClick.emit();
    }
  }
}

describe("ForgotPasswordComponent", () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let store: MockStore;
  let router: Router;
  let toastr: jest.Mocked<ToastrService>;

  const initialState = {
    auth: {
      isLoading: false,
      error: null,
      passwordResetOtpVerified: false,
    },
  };

  beforeEach(async () => {
    const routerMock = {
      navigate: jest.fn(),
    };

    const toastrMock = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn(),
    } as Partial<ToastrService>;

    await TestBed.configureTestingModule({
      declarations: [
        ForgotPasswordComponent,
        MockInputComponent,
        MockButtonComponent,
      ],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        provideMockStore({ initialState }),
        { provide: Router, useValue: routerMock },
        { provide: ToastrService, useValue: toastrMock },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
    toastr = TestBed.inject(ToastrService) as jest.Mocked<ToastrService>;

    jest.spyOn(store, "dispatch");

    store.overrideSelector(AuthSelectors.selectIsLoading, false);
    store.overrideSelector(AuthSelectors.selectError, null);
    store.overrideSelector(AuthSelectors.selectPasswordResetOtpVerified, false);

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component.interval) {
      clearInterval(component.interval);
      component.interval = null;
    }
    jest.clearAllMocks();
  });

  describe("Form Initialization", () => {
    it("should create component", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize forms correctly", () => {
      const emailControl = component.forgotPasswordForm.get("email");
      expect(emailControl).toBeTruthy();
      expect(emailControl?.value).toBe("");
      expect(emailControl?.hasValidator(Validators.required)).toBeTruthy();
      expect(emailControl?.hasValidator(Validators.email)).toBeTruthy();

      expect(component.otpControls.length).toBe(5);
      component.otpControls.controls.forEach((control) => {
        expect(control.value).toBe("");
        expect(control.hasValidator(Validators.required)).toBeTruthy();
      });
    });
  });

  describe("Email Validation", () => {
    it("should validate required email", () => {
      const emailControl = component.forgotPasswordForm.get("email");
      emailControl?.setValue("");
      emailControl?.markAsTouched();
      expect(component.isFieldInvalid("email")).toBeTruthy();
    });

    it("should validate email format", () => {
      const emailControl = component.forgotPasswordForm.get("email");
      emailControl?.setValue("invalid-email");
      emailControl?.markAsTouched();
      expect(component.isFieldInvalid("email")).toBeTruthy();

      emailControl?.setValue("valid@email.com");
      expect(component.isFieldInvalid("email")).toBeFalsy();
    });
  });

  describe("Timer Functions", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
      component.clearTimer();
    });

    it("should format time correctly", () => {
      expect(component.formatTime(65)).toBe("01:05");
      expect(component.formatTime(599)).toBe("09:59");
      expect(component.formatTime(0)).toBe("00:00");
    });

    it("should start countdown correctly", () => {
      component.startCountdown();
      expect(component.timeLeft).toBe(599);
      expect(component.timerExpired).toBeFalsy();

      jest.advanceTimersByTime(1000);
      expect(component.timeLeft).toBe(598);
    });

    it("should clear timer correctly", () => {
      component.startCountdown();
      component.clearTimer();
      expect(component.interval).toBeNull();
    });
  });

  describe("Form Submission", () => {
    it("should handle valid email submission", () => {
      const email = "test@example.com";
      component.forgotPasswordForm.get("email")?.setValue(email);
      component.onSubmit();

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.forgotPassword({ email }),
      );
      expect(component.isEmailSubmitted).toBeTruthy();
      expect(component.previousEmail).toBe(email);
    });

    it("should handle invalid email submission", () => {
      component.forgotPasswordForm.get("email")?.setValue("invalid-email");
      component.onSubmit();
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(toastr.error).toHaveBeenCalledWith(
        "Please enter a valid email address",
      );
    });
  });

  describe("OTP Handling", () => {
    beforeEach(() => {
      component.previousEmail = "test@example.com";
      component.showOtpScreen = true;
      fixture.detectChanges();
    });

    it("should handle OTP verification", () => {
      component.otpControls.controls.forEach((control) =>
        control.setValue("1"),
      );
      component.verifyOtp();

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.verifyPasswordResetOtp({
          otp: "11111",
        }),
      );
    });

    it("should handle invalid OTP", () => {
      component.verifyOtp();
      expect(store.dispatch).not.toHaveBeenCalled();
      expect(toastr.error).toHaveBeenCalledWith(
        "Please fill in all OTP digits",
      );
    });

    it("should handle expired OTP", () => {
      component.timerExpired = true;
      component.otpControls.controls.forEach((control) =>
        control.setValue("1"),
      );
      component.verifyOtp();

      expect(store.dispatch).not.toHaveBeenCalled();
      expect(toastr.error).toHaveBeenCalledWith(
        "OTP has expired. Please request a new one.",
      );
    });
  });

  describe("OTP Input Navigation", () => {
    it("should handle numeric input", () => {
      const mockInput = document.createElement("input");
      const mockNextInput = document.createElement("input");
      mockNextInput.focus = jest.fn();

      Object.defineProperty(mockInput, "nextElementSibling", {
        value: mockNextInput,
      });
      mockInput.value = "1";

      const event = new KeyboardEvent("keyup", { key: "1" });
      Object.defineProperty(event, "target", { value: mockInput });

      component.onOtpInput(event);
      expect(mockNextInput.focus).toHaveBeenCalled();
    });

    it("should handle backspace", () => {
      const mockInput = document.createElement("input");
      const mockPrevInput = document.createElement("input");
      mockPrevInput.focus = jest.fn();

      Object.defineProperty(mockInput, "previousElementSibling", {
        value: mockPrevInput,
      });
      mockInput.value = "";

      const event = new KeyboardEvent("keyup", { key: "Backspace" });
      Object.defineProperty(event, "target", { value: mockInput });

      component.onOtpInput(event);
      expect(mockPrevInput.focus).toHaveBeenCalled();
    });
  });

  describe("Navigation", () => {
    it("should handle back navigation", () => {
      component.showOtpScreen = true;
      component.handleBackNavigation();
      expect(component.showOtpScreen).toBeFalsy();

      component.isEmailSubmitted = true;
      component.handleBackNavigation();
      expect(component.isEmailSubmitted).toBeFalsy();

      component.handleBackNavigation();
      expect(router.navigate).toHaveBeenCalledWith(["/auth/login"]);
    });

    it("should show OTP form", () => {
      component.showOtpForm();
      expect(component.showOtpScreen).toBeTruthy();
      expect(component.timeLeft).toBe(599);
    });
  });

  describe("Reset and Recovery", () => {
    it("should reset form correctly", () => {
      component.isEmailSubmitted = true;
      component.showOtpScreen = true;
      component.verificationSuccessful = true;
      component.verificationFailed = true;
      component.statusMessage = "Test message";

      component.resetForm();

      expect(component.isEmailSubmitted).toBeFalsy();
      expect(component.showOtpScreen).toBeFalsy();
      expect(component.verificationSuccessful).toBeFalsy();
      expect(component.verificationFailed).toBeFalsy();
      expect(component.statusMessage).toBe("");
      expect(component.forgotPasswordForm.pristine).toBeTruthy();
      expect(component.otpForm.pristine).toBeTruthy();
    });

    it("should handle new code request", () => {
      const email = "test@example.com";
      component.previousEmail = email;

      component.requestNewCode();
      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.requestNewOtp({ email }),
      );
      expect(component.verificationFailed).toBeFalsy();
      expect(component.timerExpired).toBeFalsy();
    });
  });

  describe("Error Handling", () => {
    it("should handle API errors", () => {
      const error = "Test error";
      store.overrideSelector(AuthSelectors.selectError, error);
      store.refreshState();

      expect(component.statusMessage).toBe(error);
      expect(toastr.error).toHaveBeenCalledWith(error);
    });
  });
});
