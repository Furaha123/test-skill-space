import { TestBed } from "@angular/core/testing";
import { GoogleAuthService } from "./google-auth.service";
import {
  HttpTestingController,
  provideHttpClientTesting,
} from "@angular/common/http/testing";
import { provideHttpClient, withFetch } from "@angular/common/http";
import { AuthResponse } from "../models/auth-response.model";

describe("GoogleAuthService", () => {
  let service: GoogleAuthService;
  let httpTestingController: HttpTestingController;
  const baseUrl =
    "https://59cf-102-22-146-226.ngrok-free.app/api/v1/auth/register/google";

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GoogleAuthService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(GoogleAuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("postRegistration", () => {
    it("should send POST request with token and email", (done) => {
      // Arrange
      const mockToken = "mock-token-123";
      const mockEmail = "test@example.com";
      const mockResponse: AuthResponse = {
        data: {
          email: "test@example.com",
          roles: ["USER"],
          token: "jwt-token-123",
        },
        message: "Registration successful",
        status: "success",
      };

      // Act & Assert
      service.postRegistration(mockToken, mockEmail).subscribe({
        next: (response) => {
          expect(response).toEqual(mockResponse);
          done();
        },
        error: done.fail,
      });

      // Assert HTTP request
      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual({ token: mockToken, email: mockEmail });

      // Respond with mock data
      req.flush(mockResponse);
    });

    it("should handle error response", (done) => {
      // Arrange
      const mockToken = "invalid-token";
      const mockEmail = "test@example.com";
      const mockErrorResponse = {
        status: 400,
        statusText: "Bad Request",
        error: { message: "Invalid token" },
      };

      // Act & Assert
      service.postRegistration(mockToken, mockEmail).subscribe({
        next: () => {
          done.fail("should have failed with an error");
        },
        error: (error) => {
          expect(error.status).toBe(400);
          expect(error.error.message).toBe("Invalid token");
          done();
        },
      });

      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.method).toBe("POST");

      // Respond with mock error
      req.flush(mockErrorResponse.error, mockErrorResponse);
    });

    it("should send request to correct URL", (done) => {
      // Arrange
      const mockToken = "mock-token-123";
      const mockEmail = "test@example.com";

      // Act
      service.postRegistration(mockToken, mockEmail).subscribe({
        next: () => done(),
        error: done.fail,
      });

      // Assert
      const req = httpTestingController.expectOne(baseUrl);
      expect(req.request.url).toBe(baseUrl);

      // Complete the request
      req.flush({});
    });
  });
});
