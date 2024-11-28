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
  onChange = () => {};
  onTouch = () => {};

  writeValue(value: unknown): void {
    if (value !== undefined) {
      this.control.setValue(value);
    }
  }

  registerOnChange(fn: () => void): void {
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
  let router: jest.Mocked<Router>;

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
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router) as jest.Mocked<Router>;

    store.overrideSelector(AuthSelectors.selectIsLoading, false);
    store.overrideSelector(AuthSelectors.selectError, null);
    store.overrideSelector(AuthSelectors.selectPasswordResetOtpVerified, false);

    jest.spyOn(store, "dispatch").mockImplementation(() => {});

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    store.refreshState();
    fixture.detectChanges();
  });

  afterEach(() => {
    store?.resetSelectors();
    jest.clearAllMocks();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Form Initialization", () => {
    it("should initialize forgotPasswordForm with empty email", () => {
      expect(component.forgotPasswordForm.get("email")).toBeTruthy();
      expect(component.forgotPasswordForm.get("email")?.value).toBe("");
      expect(
        component.forgotPasswordForm
          .get("email")
          ?.hasValidator(Validators.required),
      ).toBeTruthy();
      expect(
        component.forgotPasswordForm
          .get("email")
          ?.hasValidator(Validators.email),
      ).toBeTruthy();
    });

    it("should initialize otpForm with 5 empty controls", () => {
      expect(component.otpControls.length).toBe(5);
      component.otpControls.controls.forEach((control) => {
        expect(control.value).toBe("");
        expect(control.hasValidator(Validators.required)).toBeTruthy();
        expect(control.hasValidator(Validators.pattern(/[0-9]/))).toBeFalsy();
      });
    });
  });

  describe("Email Validation", () => {
    it("should validate required email", () => {
      const emailControl = component.forgotPasswordForm.get("email");
      emailControl?.setValue("");
      emailControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.isFieldInvalid("email")).toBeTruthy();
    });

    it("should validate email format", () => {
      const emailControl = component.forgotPasswordForm.get("email");
      emailControl?.setValue("invalid-email");
      emailControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.isFieldInvalid("email")).toBeTruthy();

      emailControl?.setValue("valid@email.com");
      fixture.detectChanges();
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

      jest.advanceTimersByTime(599000);
      jest.runOnlyPendingTimers();
      fixture.detectChanges();

      expect(component.timeLeft).toBe(0);
      expect(component.timerExpired).toBeTruthy();
    });

    it("should clear timer correctly", () => {
      component.startCountdown();
      jest.advanceTimersByTime(1000);
      component.clearTimer();
      expect(component.interval).toBeNull();
    });
  });

  describe("Form Submission", () => {
    it("should handle form submission with valid email", () => {
      const email = "test@example.com";
      component.forgotPasswordForm.get("email")?.setValue(email);
      fixture.detectChanges();
      component.onSubmit();

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.forgotPassword({ email }),
      );
      expect(component.isEmailSubmitted).toBeTruthy();
      expect(component.previousEmail).toBe(email);
    });

    it("should not submit with invalid email", () => {
      component.forgotPasswordForm.get("email")?.setValue("invalid-email");
      fixture.detectChanges();
      component.onSubmit();
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe("OTP Handling", () => {
    beforeEach(() => {
      component.previousEmail = "test@example.com";
      component.showOtpScreen = true;
      fixture.detectChanges();
    });

    it("should handle OTP input correctly", () => {
      const mockInput = document.createElement("input") as HTMLInputElement;
      const mockNextInput = document.createElement("input") as HTMLInputElement;
      mockNextInput.focus = jest.fn();

      Object.defineProperty(mockInput, "nextElementSibling", {
        value: mockNextInput,
      });
      Object.defineProperty(mockInput, "value", { value: "1" });

      const event = new KeyboardEvent("keyup", { key: "1" });
      Object.defineProperty(event, "target", { value: mockInput });

      component.onOtpInput(event);
      expect(mockNextInput.focus).toHaveBeenCalled();
    });

    it("should handle backspace in OTP input", () => {
      const mockInput = document.createElement("input") as HTMLInputElement;
      const mockPrevInput = document.createElement("input") as HTMLInputElement;
      mockPrevInput.focus = jest.fn();

      Object.defineProperty(mockInput, "previousElementSibling", {
        value: mockPrevInput,
      });
      Object.defineProperty(mockInput, "value", { value: "" });

      const event = new KeyboardEvent("keyup", { key: "Backspace" });
      Object.defineProperty(event, "target", { value: mockInput });

      component.onOtpInput(event);
      expect(mockPrevInput.focus).toHaveBeenCalled();
    });

    it("should verify valid OTP", () => {
      component.otpControls.controls.forEach((control) =>
        control.setValue("1"),
      );
      fixture.detectChanges();
      component.verifyOtp();

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.verifyPasswordResetOtp({
          email: "test@example.com",
          otp: "11111",
        }),
      );
    });

    it("should not verify invalid OTP", () => {
      component.verifyOtp();
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });

  describe("Navigation and UI State", () => {
    it("should handle back navigation correctly", () => {
      component.showOtpScreen = true;
      component.handleBackNavigation();
      expect(component.showOtpScreen).toBeFalsy();

      component.isEmailSubmitted = true;
      component.handleBackNavigation();
      expect(component.isEmailSubmitted).toBeFalsy();

      component.handleBackNavigation();
      expect(router.navigate).toHaveBeenCalledWith(["/auth/login"]);
    });

    it("should navigate to create new password", () => {
      component.createNewPassword();
      expect(router.navigate).toHaveBeenCalledWith(["/auth/reset-password"]);
    });

    it("should show OTP form", () => {
      component.showOtpForm();
      expect(component.showOtpScreen).toBeTruthy();
      expect(component.timeLeft).toBe(599);
    });
  });

  describe("Reset and Recovery Functions", () => {
    it("should reset form correctly", () => {
      component.resetForm();
      expect(component.isEmailSubmitted).toBeTruthy();
      expect(component.tryNewEmailClicked).toBeTruthy();
      expect(component.showOtpScreen).toBeFalsy();
      expect(component.verificationSuccessful).toBeFalsy();
      expect(component.verificationFailed).toBeFalsy();
      expect(component.forgotPasswordForm.pristine).toBeTruthy();
    });

    it("should handle new email request", () => {
      const email = "test@example.com";
      component.previousEmail = email;
      fixture.detectChanges();

      component.otpControls.controls.forEach((control) => {
        control.reset();
      });
      fixture.detectChanges();

      component.requestNewCode();

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.requestNewOtp({ email }),
      );
      expect(component.verificationFailed).toBeFalsy();

      component.otpControls.controls.forEach((control) => {
        expect(control.enabled).toBeTruthy();
        expect(control.value).toBe(null);
      });

      expect(component.timerExpired).toBeFalsy();
      expect(component.timeLeft).toBe(599);
    });

    it("should handle try new email cancellation", () => {
      const previousEmail = "test@example.com";
      component.previousEmail = previousEmail;
      component.cancelTryNewEmail();

      expect(component.tryNewEmailClicked).toBeFalsy();
      expect(component.isEmailSubmitted).toBeTruthy();
      expect(component.forgotPasswordForm.get("email")?.value).toBe(
        previousEmail,
      );
    });
  });

  describe("Component Lifecycle and State", () => {
    it("should clean up on destroy", () => {
      const clearTimerSpy = jest.spyOn(component, "clearTimer");
      component.startCountdown();
      component.ngOnDestroy();
      expect(clearTimerSpy).toHaveBeenCalled();
      expect(component.interval).toBeNull();
    });

    it("should handle OTP verification success", () => {
      store.overrideSelector(
        AuthSelectors.selectPasswordResetOtpVerified,
        true,
      );
      store.refreshState();
      fixture.detectChanges();

      expect(component.verificationSuccessful).toBeTruthy();
      expect(component.verificationFailed).toBeFalsy();
    });
  });

  describe("UI Helper Methods", () => {
    it("should get correct back button text", () => {
      component.showOtpScreen = true;
      expect(component.getBackButtonText()).toBe("Back ");

      component.showOtpScreen = false;
      component.isEmailSubmitted = true;
      expect(component.getBackButtonText()).toBe("Back ");

      component.isEmailSubmitted = false;
      expect(component.getBackButtonText()).toBe("Back");
    });

    it("should determine if back button should be shown", () => {
      component.verificationSuccessful = false;
      expect(component.shouldShowBackButton()).toBeTruthy();

      component.verificationSuccessful = true;
      expect(component.shouldShowBackButton()).toBeFalsy();
    });
  });
});
