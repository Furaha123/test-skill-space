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
import { provideHttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
import { AuthResponse } from "../../models/auth-response.model";
import { Router } from "@angular/router";
import { GoogleAuthService } from "../../services/google-auth.service";
import { of, throwError } from "rxjs";

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
  let router: Router;
  let googleAuthService: GoogleAuthService;

  // Mock the Google API
  const mockGoogle = {
    accounts: {
      id: {
        initialize: jest.fn(),
        renderButton: jest.fn(),
        prompt: jest.fn(),
      },
    },
  };

  // Mock JWT token for testing
  const mockJwtToken =
    "header.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20ifQ.signature";

  // Mock localStorage
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
  };

  // Mock ToastrService
  const mockToastrService = {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
  };

  beforeEach(async () => {
    // Mock window.google
    Object.defineProperty(window, "google", {
      value: mockGoogle,
      writable: true,
    });

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: mockLocalStorage,
    });

    const mockGoogleAuthService = {
      postLogin: jest.fn(),
    };

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
        provideHttpClient(),
        provideMockStore({
          selectors: [{ selector: selectError, value: null }],
        }),
        {
          provide: ToastrService,
          useValue: mockToastrService,
        },
        {
          provide: GoogleAuthService,
          useValue: mockGoogleAuthService,
        },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = jest.spyOn(store, "dispatch");
    router = TestBed.inject(Router);
    googleAuthService = TestBed.inject(GoogleAuthService);

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

  describe("handleCredentialResponse", () => {
    const mockCredential = {
      credential: mockJwtToken,
    };

    const mockAuthResponse: AuthResponse = {
      data: {
        email: "john@example.com",
        roles: ["TALENT"],
        token: "jwt-token-123",
      },
      message: "Success",
      status: "success",
    };

    beforeEach(() => {
      // Reset localStorage mock
      mockLocalStorage.setItem.mockClear();
      mockLocalStorage.getItem.mockClear();
    });

    it("should handle successful login for talent role", () => {
      // Arrange
      const navigateSpy = jest.spyOn(router, "navigate");
      jest
        .spyOn(googleAuthService, "postLogin")
        .mockReturnValue(of(mockAuthResponse));

      // Act
      component.handleCredentialResponse(mockCredential);

      // Assert
      expect(googleAuthService.postLogin).toHaveBeenCalledWith(
        mockCredential.credential,
        "john@example.com",
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "token",
        mockAuthResponse.data.token,
      );
      expect(navigateSpy).toHaveBeenCalledWith(["/talent"]);
    });

    it("should handle successful login for admin role", () => {
      // Arrange
      const adminResponse = {
        ...mockAuthResponse,
        data: { ...mockAuthResponse.data, roles: ["ADMIN"] },
      };
      const navigateSpy = jest.spyOn(router, "navigate");
      jest
        .spyOn(googleAuthService, "postLogin")
        .mockReturnValue(of(adminResponse));

      // Act
      component.handleCredentialResponse(mockCredential);

      // Assert
      expect(navigateSpy).toHaveBeenCalledWith(["/admin-dashboard"]);
    });

    it("should handle login error", () => {
      // Arrange
      const errorMessage = "Login failed";
      const postLoginSpy = jest
        .spyOn(googleAuthService, "postLogin")
        .mockReturnValue(throwError(() => new Error(errorMessage)));

      // Act
      component.handleCredentialResponse(mockCredential);

      // Assert
      expect(postLoginSpy).toHaveBeenCalled();
      expect(mockToastrService.error).toHaveBeenCalledWith(
        "Failed to login",
        errorMessage,
      );
    });

    it("should not process empty credential", () => {
      // Arrange
      const postLoginSpy = jest.spyOn(googleAuthService, "postLogin");

      // Act
      component.handleCredentialResponse({ credential: "" });

      // Assert
      expect(postLoginSpy).not.toHaveBeenCalled();
    });
  });

  describe("setUserInfo", () => {
    it("should set userName from decoded token", () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue(mockJwtToken);

      // Act
      component["setUserInfo"]();

      // Assert
      expect(component.userName).toBe("John Doe");
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("token");
    });

    it("should handle null token", () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue(null);

      // Act & Assert
      expect(() => {
        component["setUserInfo"]();
      }).toThrow();
    });
  });

  describe("decodeJwtResponse", () => {
    it("should correctly decode JWT token", () => {
      // Act
      const decoded = component["decodeJwtResponse"](mockJwtToken);

      // Assert
      expect(decoded).toEqual({
        name: "John Doe",
        email: "john@example.com",
      });
    });

    it("should throw error for invalid token", () => {
      // Act & Assert
      expect(() => {
        component["decodeJwtResponse"]("invalid-token");
      }).toThrow();
    });

    it("should handle token with special characters", () => {
      // Arrange
      const tokenWithSpecialChars =
        "header.eyJuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG4rMUBleGFtcGxlLmNvbSJ9.signature";

      // Act
      const decoded = component["decodeJwtResponse"](tokenWithSpecialChars);

      // Assert
      expect(decoded).toEqual({
        name: "John Doe",
        email: "john+1@example.com",
      });
    });
  });
});
