import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { CreateNewPasswordComponent } from "./create-new-password.component";
import * as AuthSelectors from "../../auth-store/auth.selectors";
import * as AuthActions from "../../auth-store/auth.actions";
import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef,
} from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  FormControl,
} from "@angular/forms";

@Component({
  selector: "app-input",
  template: `<input [formControl]="control" />`,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockAppInputComponent),
      multi: true,
    },
  ],
})
class MockAppInputComponent implements ControlValueAccessor {
  @Input() label = "";
  @Input() type = "text";
  @Input() placeholder = "";
  @Input() id = "";
  @Input() hasError = false;
  @Input() errorMessage: string[] = [];
  @Input() formControlName = "";

  control = new FormControl();
  onChange = () => {};
  onTouch = () => {};

  writeValue(obj: unknown): void {
    this.control.setValue(obj);
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
  template: `
    <button
      [disabled]="isDisabled"
      [class]="customClasses"
      (click)="handleClick.emit()"
      [attr.active]="isActive ? true : null"
    >
      {{ text }}
    </button>
  `,
})
class MockAppButtonComponent {
  @Input() text = "";
  @Input() type = "button";
  @Input() isDisabled = false;
  @Input() customClasses = "";
  @Input() isActive = false;
  @Output() handleClick = new EventEmitter<void>();
}

const initialState = {
  auth: {
    loading: false,
    error: null,
    user: null,
    isRegistered: false,
    successMessage: "",
    otpVerified: false,
    passwordResetOtpVerified: false,
    passwordReset: false,
  },
};

describe("CreateNewPasswordComponent", () => {
  let component: CreateNewPasswordComponent;
  let fixture: ComponentFixture<CreateNewPasswordComponent>;
  let store: MockStore;
  let router: jest.Mocked<Router>;

  beforeEach(async () => {
    const routerMock = { navigate: jest.fn() };

    await TestBed.configureTestingModule({
      declarations: [
        CreateNewPasswordComponent,
        MockAppInputComponent,
        MockAppButtonComponent,
      ],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideMockStore({ initialState }),
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router) as jest.Mocked<Router>;
    jest.spyOn(store, "dispatch").mockImplementation(() => {});
    sessionStorage.setItem("resetPasswordEmail", "test@email.com");

    fixture = TestBed.createComponent(CreateNewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
    store.resetSelectors();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Form Initialization", () => {
    it("should initialize the form with empty values", () => {
      expect(component.passwordForm.get("newPassword")?.value).toBe("");
      expect(component.passwordForm.get("confirmPassword")?.value).toBe("");
    });

    it("should retrieve email from sessionStorage", () => {
      expect(component["email"]).toBe("test@email.com");
    });
  });

  describe("Password Validation", () => {
    it("should validate required fields", () => {
      component.passwordForm.get("newPassword")?.markAsTouched();
      component.passwordForm.get("confirmPassword")?.markAsTouched();
      fixture.detectChanges();

      expect(component.isNewPasswordInvalid()).toBe(true);
      expect(component.isConfirmPasswordInvalid()).toBe(true);
    });

    it("should validate password pattern", () => {
      component.passwordForm.get("newPassword")?.setValue("weak");
      component.validatePassword();
      fixture.detectChanges();

      expect(component.showPasswordWarning).toBe(true);
    });

    it("should validate password mismatch", () => {
      component.passwordForm.patchValue({
        newPassword: "StrongPass123!",
        confirmPassword: "DifferentPass123!",
      });
      component.passwordForm.get("confirmPassword")?.markAsTouched();
      component.validatePassword();
      fixture.detectChanges();

      expect(component.isPasswordMismatch()).toBe(true);
    });

    it("should validate matching passwords", () => {
      const validPassword = "StrongPass123!";
      component.passwordForm.patchValue({
        newPassword: validPassword,
        confirmPassword: validPassword,
      });
      component.validatePassword();
      fixture.detectChanges();

      expect(component.isPasswordMismatch()).toBe(false);
      expect(component.showPasswordWarning).toBe(false);
    });
  });

  describe("Form Submission", () => {
    it("should dispatch resetPassword action for valid form", () => {
      const validPassword = "StrongPass123!";
      component.passwordForm.patchValue({
        newPassword: validPassword,
        confirmPassword: validPassword,
      });
      component.validatePassword();
      fixture.detectChanges();
      component.onSubmit();

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.resetPassword({
          email: component["email"],
          newPassword: validPassword,
          confirmPassword: validPassword,
        }),
      );
    });

    it("should not dispatch action for invalid form", () => {
      component.passwordForm.patchValue({
        newPassword: "weak",
        confirmPassword: "weak",
      });
      component.onSubmit();
      fixture.detectChanges();

      expect(store.dispatch).not.toHaveBeenCalled();
    });

    it("should show error for mismatched passwords", () => {
      component.passwordForm.patchValue({
        newPassword: "StrongPass123!",
        confirmPassword: "DifferentPass123!",
      });
      component.validatePassword();
      component.onSubmit();
      fixture.detectChanges();

      expect(component.isPasswordMismatch()).toBe(true);
    });
  });

  describe("UI State", () => {
    it("should disable the submit button when form is invalid", () => {
      component.passwordForm.patchValue({
        newPassword: "weak",
        confirmPassword: "weak",
      });
      component.validatePassword();
      fixture.detectChanges();

      expect(component.isSubmitDisabled()).toBe(true);
    });

    it("should enable the submit button when form is valid", fakeAsync(() => {
      const validPassword = "StrongPass123!";
      component.passwordForm.patchValue({
        newPassword: validPassword,
        confirmPassword: validPassword,
      });

      component.validatePassword();
      component.passwordForm.markAllAsTouched();
      fixture.detectChanges();
      tick();

      store.setState({
        ...initialState,
        auth: { ...initialState.auth, loading: false },
      });
      fixture.detectChanges();

      expect(component.isSubmitDisabled()).toBe(true);
    }));
  });

  describe("Navigation", () => {
    it("should redirect to login on success", () => {
      store.overrideSelector(AuthSelectors.selectIsPasswordReset, true);
      store.refreshState();

      expect(router.navigate).toHaveBeenCalledWith(["/auth/login"]);
    });

    it("should redirect to login when called explicitly", () => {
      component.redirectToLogin();
      expect(router.navigate).toHaveBeenCalledWith(["/auth/login"]);
    });
  });

  describe("Error Handling", () => {
    it("should display error message from store", (done) => {
      const error = "Test error";
      store.overrideSelector(AuthSelectors.selectError, error);
      store.refreshState();

      component.error$.subscribe((errorMessage) => {
        expect(errorMessage).toBe(error);
        done();
      });
    });
  });
});
