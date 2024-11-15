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

  const mockTalent: Talent = {
    email: "test@example.com",
    password: "password123",
    phoneNumber: "1234567890",
    firstName: "John",
  };

  const mockResponse: ResponseInterface = {
    status: "success",
    message: "Operation completed",
    data: [],
  };

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

  it("should send a login request and store the token and role", () => {
    const mockResponse = { token: "mock-token", role: "admin" };
    const email = "test@example.com";
    const password = "Password123!";

    service.login(email, password).subscribe((response) => {
      expect(response.token).toBe(mockResponse.token);
      expect(response.role).toBe(mockResponse.role);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual({ email, password });

    req.flush(mockResponse);

    expect(localStorage.getItem("jwtToken")).toBe(mockResponse.token);
    expect(localStorage.getItem("userRole")).toBe(mockResponse.role);
  });

  it("should retrieve the token from localStorage", () => {
    localStorage.setItem("jwtToken", "mock-token");
    expect(service.getToken()).toBe("mock-token");
  });

  it("should retrieve the role from localStorage", () => {
    localStorage.setItem("userRole", "admin");
    expect(service.getUserRole()).toBe("admin");
  });

  it("should clear session data on logout", () => {
    localStorage.setItem("jwtToken", "mock-token");
    localStorage.setItem("userRole", "admin");

    service.logout();

    expect(localStorage.getItem("jwtToken")).toBeNull();
    expect(localStorage.getItem("userRole")).toBeNull();
  });

  describe("talentRegister", () => {
    it("should register a talent", () => {
      service.talentRegister(mockTalent).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/talent/register`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(mockTalent);
      req.flush(mockResponse);
    });
  });

  describe("verifyOTP", () => {
    it("should verify OTP", () => {
      const otpData = {
        email: "test@example.com",
        otp: "123456",
      };

      service.verifyOTP(otpData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/otp/verify-otp`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(otpData);
      req.flush(mockResponse);
    });
  });

  describe("requestNewOTP", () => {
    it("should request a new OTP", () => {
      const email = "test@example.com";

      service.requestNewOTP(email).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/otp/generate-new`);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual({ email });
      req.flush(mockResponse);
    });
  });

  describe("API URL Configuration", () => {
    it("should use the correct API URL from environment", () => {
      expect(service["apiUrl"]).toBe(environment.apiUrl);
    });
  });
});
