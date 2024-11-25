import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RegisterPageComponent } from "./register-page.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { provideMockStore } from "@ngrx/store/testing";
import { provideHttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { GoogleAuthService } from "../../services/google-auth.service";
import { of, throwError } from "rxjs";
import { AuthResponse } from "../../models/auth-response.model";
import { ToastrService } from "ngx-toastr";

describe("RegisterPageComponent", () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;
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

  const initialState = {
    auth: {
      isLoading: false,
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
      postRegistration: jest.fn(),
      postLogin: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [RegisterPageComponent],
      providers: [
        provideHttpClient(),
        provideMockStore({ initialState }),
        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
        {
          provide: GoogleAuthService,
          useValue: mockGoogleAuthService,
        },
        {
          provide: ToastrService,
          useValue: mockToastrService,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    router = TestBed.inject(Router);
    googleAuthService = TestBed.inject(GoogleAuthService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Form type switching", () => {
    describe("onRegisterCompany", () => {
      it("should set currentForm to company", () => {
        // Arrange
        component.currentForm = "talent";

        // Act
        component.onRegisterCompany();

        // Assert
        expect(component.currentForm).toBe("company");
      });

      it("should not change other component properties", () => {
        // Arrange
        const initialUserName = "John";
        component.userName = initialUserName;

        // Act
        component.onRegisterCompany();

        // Assert
        expect(component.userName).toBe(initialUserName);
      });
    });

    describe("onRegisterTalent", () => {
      it("should set currentForm to talent", () => {
        // Arrange
        component.currentForm = "company";

        // Act
        component.onRegisterTalent();

        // Assert
        expect(component.currentForm).toBe("talent");
      });

      it("should not change other component properties", () => {
        // Arrange
        const initialUserName = "John";
        component.userName = initialUserName;

        // Act
        component.onRegisterTalent();

        // Assert
        expect(component.userName).toBe(initialUserName);
      });
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

    it("should handle successful registration for talent role", () => {
      // Arrange
      const navigateSpy = jest.spyOn(router, "navigate");
      jest
        .spyOn(googleAuthService, "postRegistration")
        .mockReturnValue(of(mockAuthResponse));

      // Act
      component.handleCredentialResponse(mockCredential);

      // Assert
      expect(googleAuthService.postRegistration).toHaveBeenCalledWith(
        mockCredential.credential,
        "john@example.com",
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "token",
        mockAuthResponse.data.token,
      );
      expect(navigateSpy).toHaveBeenCalledWith(["/talent"]);
    });

    it("should handle successful registration for admin role", () => {
      // Arrange
      const adminResponse = {
        ...mockAuthResponse,
        data: { ...mockAuthResponse.data, roles: ["ADMIN"] },
      };
      const navigateSpy = jest.spyOn(router, "navigate");
      jest
        .spyOn(googleAuthService, "postRegistration")
        .mockReturnValue(of(adminResponse));

      // Act
      component.handleCredentialResponse(mockCredential);

      // Assert
      expect(navigateSpy).toHaveBeenCalledWith(["/admin-dashboard"]);
    });

    it("should handle registration error with status 409 and login successfully", () => {
      // Arrange
      const errorResponse = {
        error: { message: "User already exists" },
        status: 409,
      };
      const loginResponse: AuthResponse = {
        data: {
          email: "john@example.com",
          roles: ["TALENT"],
          token: "jwt-token-123",
        },
        message: "Success",
        status: "success",
      };
      const navigateSpy = jest.spyOn(router, "navigate");
      jest
        .spyOn(googleAuthService, "postRegistration")
        .mockReturnValue(throwError(() => errorResponse));
      jest
        .spyOn(googleAuthService, "postLogin")
        .mockReturnValue(of(loginResponse));

      // Act
      component.handleCredentialResponse(mockCredential);

      // Assert
      expect(googleAuthService.postRegistration).toHaveBeenCalledWith(
        mockCredential.credential,
        "john@example.com",
      );
      expect(googleAuthService.postLogin).toHaveBeenCalledWith(
        mockCredential.credential,
        "john@example.com",
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "token",
        loginResponse.data.token,
      );
      expect(navigateSpy).toHaveBeenCalledWith(["/talent"]);
    });

    it("should handle registration error with status 409 and login successfully for admin role", () => {
      // Arrange
      const errorResponse = {
        error: { message: "User already exists" },
        status: 409,
      };
      const loginResponse: AuthResponse = {
        data: {
          email: "john@example.com",
          roles: ["ADMIN"],
          token: "jwt-token-123",
        },
        message: "Success",
        status: "success",
      };
      const navigateSpy = jest.spyOn(router, "navigate");
      jest
        .spyOn(googleAuthService, "postRegistration")
        .mockReturnValue(throwError(() => errorResponse));
      jest
        .spyOn(googleAuthService, "postLogin")
        .mockReturnValue(of(loginResponse));

      // Act
      component.handleCredentialResponse(mockCredential);

      // Assert
      expect(googleAuthService.postLogin).toHaveBeenCalledWith(
        mockCredential.credential,
        "john@example.com",
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "token",
        loginResponse.data.token,
      );
      expect(navigateSpy).toHaveBeenCalledWith(["/admin-dashboard"]);
    });

    it("should handle registration error with status 409 and login error", () => {
      // Arrange
      const errorResponse = {
        error: { message: "User already exists" },
        status: 409,
      };
      const loginErrorMessage = "Login failed";
      jest
        .spyOn(googleAuthService, "postRegistration")
        .mockReturnValue(throwError(() => errorResponse));
      jest
        .spyOn(googleAuthService, "postLogin")
        .mockReturnValue(throwError(() => new Error(loginErrorMessage)));

      // Act
      component.handleCredentialResponse(mockCredential);

      // Assert
      expect(googleAuthService.postRegistration).toHaveBeenCalledWith(
        mockCredential.credential,
        "john@example.com",
      );
      expect(googleAuthService.postLogin).toHaveBeenCalledWith(
        mockCredential.credential,
        "john@example.com",
      );
    });

    it("should not process empty credential", () => {
      // Arrange
      const postRegistrationSpy = jest.spyOn(
        googleAuthService,
        "postRegistration",
      );

      // Act
      component.handleCredentialResponse({ credential: "" });

      // Assert
      expect(postRegistrationSpy).not.toHaveBeenCalled();
    });

    it("should handle successful registration for talent role", () => {
      // Arrange
      const navigateSpy = jest.spyOn(router, "navigate");
      jest
        .spyOn(googleAuthService, "postRegistration")
        .mockReturnValue(of(mockAuthResponse));

      // Act
      component.handleCredentialResponse(mockCredential);

      // Assert
      expect(googleAuthService.postRegistration).toHaveBeenCalledWith(
        mockCredential.credential,
        "john@example.com",
      );
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        "token",
        mockAuthResponse.data.token,
      );
      expect(navigateSpy).toHaveBeenCalledWith(["/talent"]);
    });

    it("should not navigate for non-talent role", () => {
      // Arrange
      const nonTalentResponse = {
        ...mockAuthResponse,
        data: { ...mockAuthResponse.data, roles: ["USER"] },
      };
      const navigateSpy = jest.spyOn(router, "navigate");
      jest
        .spyOn(googleAuthService, "postRegistration")
        .mockReturnValue(of(nonTalentResponse));

      // Act
      component.handleCredentialResponse(mockCredential);

      // Assert
      expect(navigateSpy).not.toHaveBeenCalled();
    });

    it("should not process empty credential", () => {
      // Arrange
      const postRegistrationSpy = jest.spyOn(
        googleAuthService,
        "postRegistration",
      );

      // Act
      component.handleCredentialResponse({ credential: "" });

      // Assert
      expect(postRegistrationSpy).not.toHaveBeenCalled();
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
