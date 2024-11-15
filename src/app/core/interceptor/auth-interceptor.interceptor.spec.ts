import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { HTTP_INTERCEPTORS, HttpClient } from "@angular/common/http";
import { AuthInterceptor } from "../interceptor/auth-interceptor.interceptor";

describe("AuthInterceptor", () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it("should add the Authorization header when token is present", () => {
    localStorage.setItem("jwtToken", "mock-token");

    httpClient.get("/test").subscribe();

    const req = httpMock.expectOne("/test");
    expect(req.request.headers.get("Authorization")).toBe("Bearer mock-token");
  });

  it("should not add the Authorization header when token is absent", () => {
    httpClient.get("/test").subscribe();

    const req = httpMock.expectOne("/test");
    expect(req.request.headers.has("Authorization")).toBeFalsy();
  });
});
