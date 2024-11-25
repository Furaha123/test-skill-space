import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
  FormBuilder,
  ReactiveFormsModule,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { LoginComponent } from "./login.component";
import * as AuthActions from "../../auth-store/auth.actions";
import { selectError } from "../../auth-store/auth.reducer";
import {
  Component,
  Input,
  forwardRef,
  EventEmitter,
  Output,
} from "@angular/core";

type FormValue = string;
type ChangeHandler = (value: FormValue) => void;
type TouchHandler = () => void;

@Component({
  selector: "app-input",
  template:
    '<input [type]="type" [id]="id" [value]="value" (input)="onChange($event)" (blur)="onTouched()">',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MockInputComponent),
      multi: true,
    },
  ],
})
class MockInputComponent implements ControlValueAccessor {
  @Input() type = "text";
  @Input() label = "";
  @Input() placeholder = "";
  @Input() id = "";
  @Input() hasError = false;
  @Input() formControlName = "";

  value: FormValue = "";
  onChange: ChangeHandler = () => {};
  onTouched: TouchHandler = () => {};

  writeValue(value: FormValue): void {
    this.value = value;
  }

  registerOnChange(fn: ChangeHandler): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: TouchHandler): void {
    this.onTouched = fn;
  }
}

@Component({
  selector: "app-button",
  template: '<button (click)="handleClick.emit()">Login</button>',
})
class MockButtonComponent {
  @Input() type = "button";
  @Output() handleClick = new EventEmitter<void>();
}

@Component({
  selector: "app-error-toast",
  template: "<div>{{subText}}</div>",
})
class MockErrorToastComponent {
  @Input() title = "";
  @Input() subText = "";
  @Input() type = "";
}

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;
  let dispatchSpy: jest.SpyInstance;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LoginComponent,
        MockInputComponent,
        MockButtonComponent,
        MockErrorToastComponent,
      ],
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule],
      providers: [
        FormBuilder,
        provideMockStore({
          selectors: [{ selector: selectError, value: null }],
        }),
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, "dispatch");

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    dispatchSpy.mockClear();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Form Initialization", () => {
    it("should initialize the form with empty values", () => {
      expect(component.loginForm.get("email")?.value).toBe("");
      expect(component.loginForm.get("password")?.value).toBe("");
    });

    it("should initialize showError$ observable", () => {
      let errorMessage: string | null = null;
      component.showError$.subscribe((error) => {
        errorMessage = error;
      });
      expect(errorMessage).toBe(null);
    });
  });

  describe("Form Validation", () => {
    describe("Email Field", () => {
      it("should be invalid when empty", () => {
        const emailControl = component.loginForm.get("email");
        emailControl?.setValue("");
        emailControl?.markAsTouched();
        fixture.detectChanges();
        expect(emailControl?.errors?.["required"]).toBeTruthy();
      });

      it("should be invalid with incorrect email format", () => {
        const emailControl = component.loginForm.get("email");
        emailControl?.setValue("invalid-email");
        emailControl?.markAsTouched();
        fixture.detectChanges();
        expect(emailControl?.errors?.["email"]).toBeTruthy();
      });

      it("should be valid with correct email format", () => {
        const emailControl = component.loginForm.get("email");
        emailControl?.setValue("test@example.com");
        emailControl?.markAsTouched();
        fixture.detectChanges();
        expect(emailControl?.valid).toBeTruthy();
      });
    });

    describe("Password Field", () => {
      it("should be invalid when empty", () => {
        const passwordControl = component.loginForm.get("password");
        passwordControl?.setValue("");
        passwordControl?.markAsTouched();
        fixture.detectChanges();
        expect(passwordControl?.errors?.["required"]).toBeTruthy();
      });

      it("should be invalid when less than 8 characters", () => {
        const passwordControl = component.loginForm.get("password");
        passwordControl?.setValue("Short1!");
        passwordControl?.markAsTouched();
        fixture.detectChanges();
        expect(passwordControl?.errors?.["minlength"]).toBeTruthy();
      });

      it("should be valid with all requirements met", () => {
        const passwordControl = component.loginForm.get("password");
        passwordControl?.setValue("Password123!");
        passwordControl?.markAsTouched();
        fixture.detectChanges();
        expect(passwordControl?.valid).toBeTruthy();
      });
    });
  });

  describe("Form Error Display", () => {
    it("should show error state for invalid email field when touched", () => {
      const emailControl = component.loginForm.get("email");
      emailControl?.setValue("invalid-email");
      emailControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.isFieldInvalid("email")).toBeTruthy();
    });

    it("should not show error state for valid email field", () => {
      const emailControl = component.loginForm.get("email");
      emailControl?.setValue("test@example.com");
      emailControl?.markAsTouched();
      fixture.detectChanges();
      expect(component.isFieldInvalid("email")).toBeFalsy();
    });
  });

  describe("Form Submission", () => {
    it("should dispatch login action with valid credentials", () => {
      const validCredentials = {
        email: "test@example.com",
        password: "Password123!",
      };

      component.loginForm.setValue(validCredentials);
      fixture.detectChanges();
      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        AuthActions.login(validCredentials),
      );
    });

    it("should not dispatch login action with invalid credentials", () => {
      const invalidCredentials = {
        email: "invalid-email",
        password: "short",
      };

      component.loginForm.setValue(invalidCredentials);
      fixture.detectChanges();
      component.onSubmit();

      expect(dispatchSpy).not.toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should display error message from store", () => {
      const errorMessage = "Invalid credentials";
      store.overrideSelector(selectError, errorMessage);
      store.refreshState();
      fixture.detectChanges();

      let currentError: string | null = null;
      component.showError$.subscribe((error) => {
        currentError = error;
      });

      expect(currentError).toBe(errorMessage);
    });
  });

  describe("Template Integration", () => {
    it("should render form elements", () => {
      const compiled = fixture.nativeElement;
      expect(compiled.querySelector("form")).toBeTruthy();
      expect(
        compiled.querySelector('app-input[formControlName="email"]'),
      ).toBeTruthy();
      expect(
        compiled.querySelector('app-input[formControlName="password"]'),
      ).toBeTruthy();
      expect(compiled.querySelector("app-button")).toBeTruthy();
    });

    it("should have working router links", () => {
      const compiled = fixture.nativeElement;
      const forgotPasswordLink = compiled.querySelector(
        'a[routerLink="/auth/forgot-password"]',
      );
      const signupLink = compiled.querySelector(
        'a[routerLink="/auth/register"]',
      );

      expect(forgotPasswordLink).toBeTruthy();
      expect(signupLink).toBeTruthy();
    });
  });
});
