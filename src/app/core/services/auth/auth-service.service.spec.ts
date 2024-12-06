import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AuthService } from "./auth-service.service";
import { environment } from "../../../../environments/environment";
import { ResponseInterface } from "../../../shared/models/response.interface";

import { Talent } from "../../../shared/models/talent.interface";
import { Company } from "../../../shared/models/company.interface";

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
    localStorage.clear();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("talentRegister", () => {
    const mockTalent: Talent = {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      password: "Password123!",
      phoneNumber: "1234567890",
    };

    const mockResponse: ResponseInterface = {
      status: "Success",
      message: "Registration successful",
    };

    it("should register talent successfully", () => {
      service.talentRegister(mockTalent).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne("/api/v1/talent/register");
      expect(req.request.method).toBe("POST");
      expect(req.request.headers.get("Content-Type")).toBe("application/json");
      expect(req.request.headers.get("ngrok-skip-browser-warning")).toBe(
        "true",
      );
      expect(req.request.body).toEqual(mockTalent);
      req.flush(mockResponse);
    });

    it("should handle talent registration error", () => {
      const errorResponse = { status: 400, statusText: "Bad Request" };

      service.talentRegister(mockTalent).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne("/api/v1/talent/register");
      req.flush(null, errorResponse);
    });
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

  describe("verifyOTP", () => {
    const otpData = {
      email: "test@example.com",
      otp: "12345",
    };

    const mockResponse: ResponseInterface = {
      status: "Success",
      message: "OTP verified successfully",
    };

    it("should verify OTP successfully", () => {
      service.verifyOTP(otpData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne("/api/v1/otp/verify-otp");
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(otpData);
      req.flush(mockResponse);
    });

    it("should handle OTP verification error", () => {
      const errorResponse = { status: 400, statusText: "Bad Request" };

      service.verifyOTP(otpData).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne("/api/v1/otp/verify-otp");
      req.flush(null, errorResponse);
    });
  });

  describe("verifyCompanyOTP", () => {
    const otpData = {
      email: "company@example.com",
      otp: "12345",
    };

    const mockResponse: ResponseInterface = {
      status: "Success",
      message: "OTP verified successfully",
    };

    it("should verify company OTP successfully", () => {
      service.verifyCompanyOTP(otpData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne("/api/v1/otp/verify-otp");
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(otpData);
      req.flush(mockResponse);
    });

    it("should handle company OTP verification error", () => {
      const errorResponse = { status: 400, statusText: "Bad Request" };

      service.verifyCompanyOTP(otpData).subscribe({
        error: (error) => {
          expect(error.status).toBe(400);
        },
      });

      const req = httpMock.expectOne("/api/v1/otp/verify-otp");
      req.flush(null, errorResponse);
    });
  });

  describe("verifyPasswordResetOtp", () => {
    const otp = "12345";
    const mockResponse = {
      status: "Success",
      message: "OTP verified successfully",
      data: { token: "reset-token-123" },
    };

    it("should verify password reset OTP and store token", () => {
      const setItemSpy = jest.spyOn(Storage.prototype, "setItem");

      service.verifyPasswordResetOtp(otp).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(setItemSpy).toHaveBeenCalledWith(
          "reset_token",
          "reset-token-123",
        );
      });

      const req = httpMock.expectOne(
        `${apiUrl}/auth/verify-password-reset-otp`,
      );
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual({ otp });
      req.flush(mockResponse);

      setItemSpy.mockRestore();
    });

    it("should handle response without token", () => {
      const responseWithoutToken = {
        status: "Success",
        message: "OTP verified successfully",
        data: {},
      };

      service.verifyPasswordResetOtp(otp).subscribe((response) => {
        expect(response).toEqual(responseWithoutToken);
      });

      const req = httpMock.expectOne(
        `${apiUrl}/auth/verify-password-reset-otp`,
      );
      req.flush(responseWithoutToken);
    });
  });

  describe("resetPassword", () => {
    const newPassword = "NewPass123!";
    const mockToken = "reset-token-123";
    const mockResponse = {
      status: "Success",
      message: "Password reset successfully",
    };

    beforeEach(() => {
      localStorage.setItem("reset_token", mockToken);
    });

    it("should reset password and remove token", () => {
      service.resetPassword(newPassword).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(localStorage.getItem("reset_token")).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/reset-password`);
      expect(req.request.method).toBe("POST");
      expect(req.request.headers.get("Reset-Token")).toBe(mockToken);
      expect(req.request.body).toEqual({ newPassword });
      req.flush(mockResponse);
    });

    it("should handle missing reset token", () => {
      localStorage.removeItem("reset_token");

      service.resetPassword(newPassword).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/auth/reset-password`);
      expect(req.request.headers.get("Reset-Token")).toBe("");
      req.flush(mockResponse);
    });
  });

  describe("requestNewOTP", () => {
    const email = "test@example.com";
    const mockResponse: ResponseInterface = {
      status: "Success",
      message: "New OTP sent successfully",
    };

    it("should request new OTP successfully", () => {
      service.requestNewOTP(email).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${apiUrl}/otp/generate-new`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual({ email });
      req.flush(mockResponse);
    });

    it("should handle error when requesting new OTP", () => {
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
      email: "TEST@example.com",
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

    it("should normalize email and set proper headers", () => {
      service.login(credentials.email, credentials.password).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
      expect(req.request.body.email).toBe(
        credentials.email.trim().toLowerCase(),
      );
      expect(req.request.headers.get("Content-Type")).toBe("application/json");
      expect(req.request.headers.get("Accept")).toBe("application/json");
      req.flush(mockResponse);
    });

    it("should handle successful login", () => {
      service
        .login(credentials.email, credentials.password)
        .subscribe((response) => {
          expect(response).toEqual(mockResponse);
        });

      const req = httpMock.expectOne(`${apiUrl}/auth/login`);
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

  describe("companyRegister", () => {
    const mockFile = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const mockCompanyData = {
      name: "Test Company",
      email: "company@test.com",
      password: "Password123!",
      phone: "1234567890",
      phoneNumber: "1234567890",
      logo: mockFile,
      certificates: mockFile,
      foundedDate: new Date("2020-01-01"),
      address: "Test Address",
      websiteUrl: "https://testcompany.com",
    } as Company;

    const mockResponse: ResponseInterface = {
      status: "Success",
      message: "Company registered successfully",
    };

    it("should register company with files", () => {
      service.companyRegister(mockCompanyData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne("/api/v1/companys/register");
      expect(req.request.method).toBe("POST");
      expect(req.request.body instanceof FormData).toBeTruthy();
      req.flush(mockResponse);
    });

    it("should retry on error", () => {
      const errorResponse = { status: 500, statusText: "Server Error" };

      service.companyRegister(mockCompanyData).subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });

      // First attempt
      const req1 = httpMock.expectOne("/api/v1/companys/register");
      req1.flush(null, errorResponse);

      // Retry attempt
      const req2 = httpMock.expectOne("/api/v1/companys/register");
      req2.flush(null, errorResponse);
    });
  });
});
