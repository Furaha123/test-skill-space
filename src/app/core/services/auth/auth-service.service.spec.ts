import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { AuthService } from "./auth-service.service";
import { environment } from "../../../../environments/environment";
import { Talent } from "../../../shared/models/talent.interface";
import { ResponseInterface } from "../../../shared/models/response.interface";

describe("AuthService", () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

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

  describe("talentRegister", () => {
    const mockTalent: Talent = {
      email: "test@example.com",
      password: "password123",
      firstName: "John",
      phoneNumber: "",
    };

    const mockResponse: ResponseInterface = {
      status: "success",
      message: "Registration successful",
      data: {
        user: mockTalent,
        token: "mock.jwt.token",
        roles: ["TALENT"],
      },
    };

    it("should register a talent successfully", () => {
      service.talentRegister(mockTalent).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/talent/register`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(mockTalent);
      req.flush(mockResponse);
    });

    it("should handle registration error appropriately", () => {
      const errorResponse: ResponseInterface = {
        status: "error",
        message: "Registration failed",
        data: {
          error: "Email already exists",
        },
      };

      service.talentRegister(mockTalent).subscribe({
        next: () => fail("should have failed with the 400 error"),
        error: (error) => {
          expect(error.error).toEqual(errorResponse);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/talent/register`);
      expect(req.request.method).toBe("POST");
      req.flush(errorResponse, { status: 400, statusText: "Bad Request" });
    });
  });

  describe("verifyOTP", () => {
    const otpData = {
      email: "test@example.com",
      otp: "123456",
    };

    const mockResponse: ResponseInterface = {
      status: "success",
      message: "OTP verified successfully",
      data: {
        verified: true,
      },
    };

    it("should verify OTP with email successfully", () => {
      service.verifyOTP(otpData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/otp/verify-otp`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(otpData);
      req.flush(mockResponse);
    });

    it("should verify OTP without email successfully", () => {
      const otpOnlyData = { otp: "123456" };

      service.verifyOTP(otpOnlyData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/otp/verify-otp`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(otpOnlyData);
      req.flush(mockResponse);
    });

    it("should handle OTP verification error appropriately", () => {
      const errorResponse: ResponseInterface = {
        status: "error",
        message: "Invalid OTP",
        data: {
          error: "OTP has expired",
        },
      };

      service.verifyOTP(otpData).subscribe({
        next: () => fail("should have failed with the 400 error"),
        error: (error) => {
          expect(error.error).toEqual(errorResponse);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/otp/verify-otp`);
      expect(req.request.method).toBe("POST");
      req.flush(errorResponse, { status: 400, statusText: "Bad Request" });
    });
  });

  describe("requestNewOTP", () => {
    const email = "test@example.com";
    const mockResponse: ResponseInterface = {
      status: "success",
      message: "New OTP sent successfully",
      data: {
        sent: true,
      },
    };

    it("should request a new OTP successfully", () => {
      service.requestNewOTP(email).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/otp/generate-new`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual({ email });
      req.flush(mockResponse);
    });

    it("should handle new OTP request error appropriately", () => {
      const errorResponse: ResponseInterface = {
        status: "error",
        message: "Failed to generate OTP",
        data: {
          error: "User not found",
        },
      };

      service.requestNewOTP(email).subscribe({
        next: () => fail("should have failed with the 404 error"),
        error: (error) => {
          expect(error.error).toEqual(errorResponse);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/otp/generate-new`);
      expect(req.request.method).toBe("POST");
      req.flush(errorResponse, { status: 404, statusText: "Not Found" });
    });
  });

  describe("login", () => {
    const email = "test@example.com";
    const password = "password123";
    const mockResponse: ResponseInterface = {
      status: "success",
      message: "Login successful",
      data: {
        token: "jwt.token.here",
        roles: ["USER"],
      },
    };

    it("should send login request with correct headers and body", () => {
      service.login(email, password).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe("POST");
      expect(req.request.headers.get("Content-Type")).toBe("application/json");
      expect(req.request.body).toEqual({ email, password });
      req.flush(mockResponse);
    });

    it("should handle login error appropriately", () => {
      const errorResponse: ResponseInterface = {
        status: "error",
        message: "Login failed",
        data: {
          error: "Invalid credentials",
        },
      };

      service.login(email, password).subscribe({
        next: () => fail("should have failed with the 401 error"),
        error: (error) => {
          expect(error.error).toEqual(errorResponse);
        },
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe("POST");
      req.flush(errorResponse, { status: 401, statusText: "Unauthorized" });
    });
  });

  describe("API URL Configuration", () => {
    it("should use the correct API URL from environment", () => {
      expect(service["apiUrl"]).toBe(environment.apiUrl);
    });
  });
});
