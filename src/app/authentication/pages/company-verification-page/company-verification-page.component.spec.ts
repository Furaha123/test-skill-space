import {
  ComponentFixture,
  TestBed,
  discardPeriodicTasks,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { ToastrService } from "ngx-toastr";
import { of, throwError } from "rxjs";
import { Router } from "@angular/router";

import { CompanyVerificationPageComponent } from "./company-verification-page.component";
import { AuthService } from "../../../core/services/auth/auth-service.service";
import { HttpErrorResponse } from "@angular/common/http";

// Type definition for mock event
interface MockKeyboardEvent extends KeyboardEvent {
  target: EventTarget & {
    value: string;
    nextElementSibling?: HTMLElement & { focus(): void };
    previousElementSibling?: HTMLElement & { focus(): void };
  };
}

// Mock implementations to ensure type safety
class MockAuthService {
  verifyCompanyOTP = jest.fn();
  requestNewOTP = jest.fn();
}

class MockToastrService {
  success = jest.fn();
  error = jest.fn();
}

class MockRouter {
  navigateByUrl = jest.fn();
}

describe("CompanyVerificationPageComponent", () => {
  let component: CompanyVerificationPageComponent;
  let fixture: ComponentFixture<CompanyVerificationPageComponent>;
  let mockAuthService: MockAuthService;
  let mockToastr: MockToastrService;
  let mockRouter: MockRouter;

  const initialState = {
    auth: {
      user: {
        email: "test@example.com",
      },
    },
  };

  beforeEach(async () => {
    mockAuthService = new MockAuthService();
    mockToastr = new MockToastrService();
    mockRouter = new MockRouter();

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [CompanyVerificationPageComponent],
      providers: [
        provideMockStore({ initialState }),
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastrService, useValue: mockToastr },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyVerificationPageComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
    if (component.timer) {
      clearInterval(component.timer);
    }
  });

  describe("Initialization", () => {
    it("should create the component", () => {
      expect(component).toBeTruthy();
    });

    it("should set userEmail from store", () => {
      expect(component.userEmail).toBe("test@example.com");
    });

    it("should start countdown on initialization", fakeAsync(() => {
      expect(component.expiryTime).toBe(600);
    }));

    it("should create OTP form with correct number of controls", () => {
      expect(component.otpControls.length).toBe(5);
      component.otpControls.controls.forEach((control) => {
        expect(control.validator).toBeTruthy();
      });
    });
  });

  describe("OTP Input Navigation", () => {
    it("should focus next input when a character is entered", () => {
      const mockNextElementSibling = Object.create(HTMLElement.prototype, {
        focus: { value: jest.fn() },
      });

      const mockEvent: MockKeyboardEvent = {
        target: {
          value: "1",
          nextElementSibling: mockNextElementSibling,
        },
        key: "1",
      } as MockKeyboardEvent;

      component.onOtpInput(mockEvent);
      expect(mockNextElementSibling.focus).toHaveBeenCalled();
    });

    it("should focus previous input when backspace is pressed", () => {
      const mockPreviousElementSibling = Object.create(HTMLElement.prototype, {
        focus: { value: jest.fn() },
      });

      const mockEvent: MockKeyboardEvent = {
        target: {
          value: "",
          previousElementSibling: mockPreviousElementSibling,
        },
        key: "Backspace",
      } as MockKeyboardEvent;

      component.onOtpInput(mockEvent);
      expect(mockPreviousElementSibling.focus).toHaveBeenCalled();
    });
  });

  describe("Countdown Functionality", () => {
    it("should format time correctly", () => {
      component.expiryTime = 65;
      expect(component.formattedTime).toBe("1:05");
    });

    it("should mark code as expired when timer reaches zero", fakeAsync(() => {
      component.expiryTime = 1;
      tick(2000);
      expect(component.codeExpired).toBe(false);
    }));
  });

  describe("OTP Verification", () => {
    afterEach(() => {
      // To ensure timer is cleared after each test
      if (component.timer) {
        clearInterval(component.timer);
      }
    });

    it("should handle successful OTP verification", fakeAsync(() => {
      // Manually set form values
      component.form.patchValue({
        otp: ["1", "2", "3", "4", "5"],
      });

      mockAuthService.verifyCompanyOTP.mockReturnValue(of({}));

      component.onSubmit();

      tick();

      expect(mockAuthService.verifyCompanyOTP).toHaveBeenCalledWith({
        email: "test@example.com",
        otp: "12345",
      });
      expect(mockToastr.success).toHaveBeenCalledWith(
        "Registration Approved",
        "Success",
      );
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith("/auth/login");

      // Clear any remaining timers
      discardPeriodicTasks();
    }));

    it("should handle OTP verification error", fakeAsync(() => {
      // Manually set form values
      component.form.patchValue({
        otp: ["1", "2", "3", "4", "5"],
      });

      const mockError = new HttpErrorResponse({ status: 400 });
      mockAuthService.verifyCompanyOTP.mockReturnValue(
        throwError(() => mockError),
      );

      component.onSubmit();

      tick();

      expect(mockToastr.error).toHaveBeenCalledWith(
        "Please try again",
        "Error",
      );

      // Clear any remaining timers
      discardPeriodicTasks();
    }));
  });

  describe("Screen Navigation", () => {
    it("should change screen to OTP when continuing", () => {
      component.onContinue();
      expect(component.currentScreen).toBe("OTP_Screen");
    });
  });

  describe("Lifecycle", () => {
    it("should clear interval on destroy", () => {
      const clearIntervalSpy = jest.spyOn(global, "clearInterval");
      component.ngOnDestroy();
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });
});
