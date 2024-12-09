import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { ToastrService } from "ngx-toastr";
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

  beforeEach(async () => {
    const routerMock = { navigate: jest.fn() };
    const toastrMock = {
      success: jest.fn(),
      error: jest.fn(),
    };

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
        { provide: ToastrService, useValue: toastrMock },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    jest.spyOn(store, "dispatch").mockImplementation(() => {});

    fixture = TestBed.createComponent(CreateNewPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
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

    it("should start with default boolean flags", () => {
      expect(component.showPasswordWarning).toBeFalsy();
      expect(component.showPasswordError).toBeFalsy();
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
      component.passwordForm.get("newPassword")?.markAsTouched();
      component.validatePassword();
      fixture.detectChanges();

      expect(component.showPasswordWarning).toBe(true);
    });

    it("should accept valid password pattern", () => {
      component.passwordForm.get("newPassword")?.setValue("StrongPass123!");
      component.passwordForm.get("newPassword")?.markAsTouched();
      component.validatePassword();
      fixture.detectChanges();

      expect(component.showPasswordWarning).toBe(false);
    });

    it("should validate password mismatch", () => {
      component.passwordForm.patchValue({
        newPassword: "StrongPass123!",
        confirmPassword: "DifferentPass123!",
      });
      component.passwordForm.get("confirmPassword")?.markAsTouched();
      component.validatePassword();
      fixture.detectChanges();

      expect(component.showPasswordError).toBe(true);
    });

    it("should validate matching passwords", () => {
      const validPassword = "StrongPass123!";
      component.passwordForm.patchValue({
        newPassword: validPassword,
        confirmPassword: validPassword,
      });
      component.passwordForm.get("newPassword")?.markAsTouched();
      component.passwordForm.get("confirmPassword")?.markAsTouched();
      component.validatePassword();
      fixture.detectChanges();

      expect(component.showPasswordError).toBe(false);
      expect(component.showPasswordWarning).toBe(false);
    });
  });

  describe("Form Submission", () => {
    const validPassword = "StrongPass123!";

    beforeEach(() => {
      component.passwordForm.patchValue({
        newPassword: validPassword,
        confirmPassword: validPassword,
      });
      component.passwordForm.get("newPassword")?.markAsTouched();
      component.passwordForm.get("confirmPassword")?.markAsTouched();
    });

    it("should dispatch resetPassword action for valid form", () => {
      component.validatePassword();
      fixture.detectChanges();
      component.onSubmit();

      expect(store.dispatch).toHaveBeenCalledWith(
        AuthActions.resetPassword({
          newPassword: validPassword,
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

    it("should mark all fields as touched on invalid submission", () => {
      component.passwordForm.patchValue({
        newPassword: "weak",
        confirmPassword: "weak",
      });
      component.onSubmit();

      expect(component.passwordForm.get("newPassword")?.touched).toBe(true);
      expect(component.passwordForm.get("confirmPassword")?.touched).toBe(true);
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

    it("should enable submit button when form is valid", () => {
      const validPassword = "StrongPass123!";
      component.passwordForm.patchValue({
        newPassword: validPassword,
        confirmPassword: validPassword,
      });
      component.passwordForm.get("newPassword")?.markAsTouched();
      component.passwordForm.get("confirmPassword")?.markAsTouched();
      component.validatePassword();
      fixture.detectChanges();

      expect(component.isSubmitDisabled()).toBe(false);
    });
  });

  describe("Store Interactions", () => {
    it("should handle loading state", (done) => {
      store.overrideSelector(AuthSelectors.selectIsLoading, true);
      store.refreshState();

      component.loading$.subscribe((loading) => {
        expect(loading).toBe(true);
        done();
      });
    });

    it("should handle password reset state", (done) => {
      store.overrideSelector(AuthSelectors.selectIsPasswordReset, true);
      store.refreshState();

      component.isPasswordReset$.subscribe((isReset) => {
        expect(isReset).toBe(true);
        done();
      });
    });
  });
});
