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
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
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
