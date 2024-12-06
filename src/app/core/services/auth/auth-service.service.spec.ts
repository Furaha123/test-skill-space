import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AuthService } from "./auth-service.service";
import { environment } from "../../../../environments/environment";
import { ResponseInterface } from "../../../shared/models/response.interface";
import { of, throwError } from "rxjs";

describe("AuthService", () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("forgotPassword", () => {
    const email = "test@example.com";
    const mockResponse: ResponseInterface = {
      status: "Success",
      message: "Reset password link sent successfully",
    };

    it("should send forgot password request", () => {
      service.forgotPassword(email).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/forget-password`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual({ email });
      req.flush(mockResponse);
    });

    it("should handle error response", () => {
      const errorResponse = { status: 400, statusText: "Bad Request" };

      service.forgotPassword(email).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/forget-password`);
      req.flush(null, errorResponse);
    });
  });

  describe("verifyPasswordResetOtp", () => {
    const otp = "12345";
    const mockResponse: ResponseInterface = {
      status: "Success",
      message: "OTP verified successfully",
    };

    it("should verify password reset OTP", () => {
      service.verifyPasswordResetOtp(otp).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${apiUrl}/auth/verify-password-reset-otp`,
      );
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(otp);
      req.flush(mockResponse);
    });

    it("should handle error response", () => {
      const errorResponse = { status: 400, statusText: "Bad Request" };

      service.verifyPasswordResetOtp(otp).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(
        `${apiUrl}/auth/verify-password-reset-otp`,
      );
      req.flush(null, errorResponse);
    });
  });

  describe("resetPassword", () => {
    const newPassword = "NewPass123!";
    const mockResponse: ResponseInterface = {
      status: "Success",
      message: "Password reset successfully",
    };

    it("should reset password", () => {
      service.resetPassword(newPassword).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/reset-password`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(newPassword);
      req.flush(mockResponse);
    });

    it("should handle error response", () => {
      const errorResponse = { status: 400, statusText: "Bad Request" };

      service.resetPassword(newPassword).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/reset-password`);
      req.flush(null, errorResponse);
    });
  });

  describe("verifyOTP", () => {
    const otpData = {
      email: "test@example.com",
      otp: "12345",
    };
    const mockResponse: ResponseInterface = {
      status: "Success",
      message: "OTP verified successfully",
    };

    let verifyOtpSpy: jest.SpyInstance;

    beforeEach(() => {
      verifyOtpSpy = jest.spyOn(service, "verifyOTP");
    });

    afterEach(() => {
      httpMock.verify();
      jest.clearAllMocks();
    });

    it("should verify OTP", (done) => {
      verifyOtpSpy.mockReturnValue(of(mockResponse));

      service.verifyOTP(otpData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(verifyOtpSpy).toHaveBeenCalledWith(otpData);
        done();
      });
    });

    it("should handle error response", (done) => {
      const errorResponse = { status: 400, statusText: "Bad Request" };

      // Mock implementation to return an error
      verifyOtpSpy.mockReturnValue(throwError(() => errorResponse));

      service.verifyOTP(otpData).subscribe({
        next: () => {
          fail("This should not be called");
        },
        error: (error) => {
          expect(error.status).toBe(400);
          expect(verifyOtpSpy).toHaveBeenCalledWith(otpData); // Verify the spy was called
          done();
        },
      });
    });
  });

  describe("requestNewOTP", () => {
    const email = "test@example.com";
    const mockResponse: ResponseInterface = {
      status: "Success",
      message: "New OTP sent successfully",
    };

    it("should request new OTP", () => {
      service.requestNewOTP(email).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/otp/generate-new`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual({ email });
      req.flush(mockResponse);
    });

    it("should handle error response", () => {
      const errorResponse = { status: 400, statusText: "Bad Request" };

      service.requestNewOTP(email).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/otp/generate-new`);
      req.flush(null, errorResponse);
    });
  });

  describe("login", () => {
    const credentials = {
      email: "test@example.com",
      password: "Password123!",
    };
    const mockResponse = {
      status: "Success",
      message: "Login successful",
      data: {
        token: "mockToken",
        roles: ["USER"],
      },
    };

    it("should login successfully", () => {
      service
        .login(credentials.email, credentials.password)
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(credentials);
      expect(req.request.headers.has("Content-Type")).toBeTruthy();
      expect(req.request.headers.get("Content-Type")).toBe("application/json");
      req.flush(mockResponse);
    });

    it("should handle login error", () => {
      const errorResponse = { status: 401, statusText: "Unauthorized" };

      service.login(credentials.email, credentials.password).subscribe({
        error: (error) => {
          expect(error.status).toBe(401);
        },
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
      req.flush(null, errorResponse);
    });
  });
});
