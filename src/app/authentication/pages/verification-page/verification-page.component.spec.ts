import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { VerificationPageComponent } from "./verification-page.component";
import { AuthServiceService } from "../../../core/services/auth/auth-service.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { of, throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Talent } from "../../../shared/models/talent.interface";

describe("VerificationPageComponent", () => {
  let component: VerificationPageComponent;
  let fixture: ComponentFixture<VerificationPageComponent>;
  let mockAuthService: jest.Mocked<AuthServiceService>;
  let mockToastrService: jest.Mocked<ToastrService>;
  let mockRouter: jest.Mocked<Router>;
  let mockStore: { select: jest.Mock };

  beforeEach(async () => {
    mockAuthService = {
      verifyOTP: jest.fn(),
      requestNewOTP: jest.fn(),
    } as unknown as jest.Mocked<AuthServiceService>;

    mockToastrService = {
      success: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<ToastrService>;

    mockRouter = {
      navigateByUrl: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockStore = {
      select: jest
        .fn()
        .mockReturnValue(of({ email: "test@example.com" } as Talent)),
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [VerificationPageComponent],
      providers: [
        { provide: AuthServiceService, useValue: mockAuthService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: Router, useValue: mockRouter },
        { provide: Store, useValue: mockStore },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(VerificationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Component Initialization", () => {
    it("should create with default values", () => {
      expect(component).toBeTruthy();
      expect(component.currentScreen).toBe("checkMailScreem");
      expect(component.expiryTime).toBe(600);
      expect(component.codeExpired).toBeFalsy();
      expect(component.isLoading).toBeFalsy();
      expect(component.verrificationError).toBeFalsy();
    });

    it("should handle null user data", () => {
      mockStore.select.mockReturnValue(of(null));
      component.ngOnInit();
      expect(component.userEmail).toBe("test@example.com");
    });

    it("should initialize form with validators", () => {
      const formControls = Object.keys(component.form.controls);
      expect(formControls).toEqual([
        "field1",
        "field2",
        "field3",
        "field4",
        "field5",
      ]);

      formControls.forEach((control) => {
        const validators = component.form.get(control)?.validator;
        expect(validators).toBeTruthy();
      });
    });
  });

  describe("Form Validation", () => {
    it("should validate max length for each field", () => {
      const field = component.form.get("field1");
      field?.setValue("12");
      expect(field?.errors?.["maxlength"]).toBeTruthy();
    });

    it("should validate required fields", () => {
      Object.keys(component.form.controls).forEach((key) => {
        const control = component.form.get(key);
        control?.setValue("");
        expect(control?.errors?.["required"]).toBeTruthy();
      });
    });
  });

  describe("OTP Verification", () => {
    beforeEach(() => {
      Object.keys(component.form.controls).forEach((key, index) => {
        component.form.get(key)?.setValue(index.toString());
      });
    });

    it("should handle verification with empty email", () => {
      component.userEmail = "";
      component.OnVerifyOTP();
      expect(mockAuthService.verifyOTP).not.toHaveBeenCalled();
      expect(mockToastrService.error).toHaveBeenCalled();
    });

    it("should handle network error during verification", () => {
      mockAuthService.verifyOTP.mockReturnValue(
        throwError(() => new Error("Network Error")),
      );
      component.OnVerifyOTP();
      expect(component.verrificationError).toBeTruthy();
      expect(mockToastrService.error).toHaveBeenCalledWith(
        "Oops!, something went wrong",
        "Error",
      );
    });

    it("should handle 400 error during verification", () => {
      const error = new HttpErrorResponse({
        status: 400,
        error: "Bad Request",
      });
      mockAuthService.verifyOTP.mockReturnValue(throwError(() => error));
      component.OnVerifyOTP();
      expect(mockToastrService.error).toHaveBeenCalledWith(
        "Please try again",
        "Error",
      );
    });
  });

  describe("Timer Functionality", () => {
    it("should handle immediate expiry", fakeAsync(() => {
      component.expiryTime = 1;
      component.onContinue();
      tick(1000);
      expect(component.codeExpired).toBeTruthy();
    }));

    it("should format time with single digit minutes", () => {
      component.expiryTime = 540; // 9 minutes
      expect(component.formattedTime).toBe("9:00");
    });

    it("should handle zero time remaining", () => {
      component.expiryTime = 0;
      expect(component.formattedTime).toBe("0:00");
    });
  });

  describe("Request New Code", () => {
    it("should handle empty email when requesting new code", () => {
      component.userEmail = "";
      component.onRequestNewCode();
      expect(mockAuthService.requestNewOTP).not.toHaveBeenCalled();
      expect(mockToastrService.error).toHaveBeenCalled();
    });

    it("should reset verification error on successful new code request", () => {
      component.verrificationError = true;
      mockAuthService.requestNewOTP.mockReturnValue(
        of({ status: "success", message: "OTP sent" }),
      );
      component.onRequestNewCode();
      expect(component.verrificationError).toBeFalsy();
    });

    it("should handle server timeout when requesting new code", () => {
      const timeoutError = new HttpErrorResponse({
        status: 504,
        error: "Gateway Timeout",
      });
      mockAuthService.requestNewOTP.mockReturnValue(
        throwError(() => timeoutError),
      );
      component.onRequestNewCode();
      expect(mockToastrService.error).toHaveBeenCalled();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith("/auth/register");
    });
  });

  describe("Component Cleanup", () => {
    it("should clear timers and subscriptions on destroy", fakeAsync(() => {
      component.onContinue();
      const initialTime = component.expiryTime;
      component.ngOnDestroy();
      tick(2000);
      expect(component.expiryTime).toBe(initialTime);
    }));
  });
});
